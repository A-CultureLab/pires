import { inputObjectType, mutationField, nonNull } from "nexus"
import getIUser from "../../../utils/getIUser"

import { userMessaging } from "../../../lib/firebase";
import { CHAT_CREATED, CHAT_ROOM_UPDATED } from "../../subscriptions";

const CreateChatInput = inputObjectType({
    name: 'CreateChatInput',
    definition(t) {
        t.nonNull.string('chatRoomId')
        t.nullable.string('message')
        t.nullable.string('image')
    }
})


export const createChat = mutationField(t => t.nonNull.field('createChat', {
    type: 'Chat',
    args: {
        input: nonNull(CreateChatInput)
    },
    resolve: async (_, { input }, ctx) => {

        const user = await getIUser(ctx)

        const chatRoom = await ctx.prisma.chatRoom.findUnique({
            where: { id: input.chatRoomId },
            include: {
                userChatRoomInfos: { include: { user: true } }
            }
        })
        if (!chatRoom) throw new Error('No ChatRoom')

        const chatRoomUsers = chatRoom.userChatRoomInfos.map(v => v.user)
        const userChatRoomInfos = chatRoom.userChatRoomInfos

        // 해당 채팅방에 유저가 있는지 확인
        if (!chatRoomUsers.find(v => v.id === user.id)) throw new Error('no Permission')


        if (chatRoom.type === 'private') {
            // 차단하거나 차단 당한 채팅이라면 오류
            if (!!userChatRoomInfos.find(v => v.blocked)) throw new Error('Blocked ChatRoom')
            // private 채팅중 상대방이 나가기 (차단 아님)를 누른 상태일때 다시 채팅방리스트 스크린 UI에 표시해주기 위해 jointedAt을 now로 설정해줌 
            await ctx.prisma.userChatRoomInfo.updateMany({
                where: {
                    chatRoomId: chatRoom.id,
                    joinedAt: null
                },
                data: {
                    joinedAt: new Date()
                }
            })

        }

        const chat = await ctx.prisma.chat.create({
            data: {
                chatRoom: { connect: { id: input.chatRoomId } },
                message: input.message || undefined,
                image: input.image || undefined,
                user: { connect: { id: user.id } },
                notReadUserChatRoomInfos: { connect: userChatRoomInfos.filter(v => v.userId !== user.id).map(v => ({ id: v.id })) }
            }
        })

        await ctx.prisma.chatRoom.update({
            where: { id: chat.chatRoomId },
            data: { recentChatCreatedAt: chat.createdAt }
        })



        ctx.pubsub.publish(CHAT_CREATED, chat)
        ctx.pubsub.publish(CHAT_ROOM_UPDATED, chatRoom)

        const notificationOnUsers = userChatRoomInfos
            .filter(v => v.notificated) // notificated true 상태인 유저로 필터링
            .filter(v => v.userId !== user.id) // 발신자 제외
            .filter(v => !!v.user.fcmToken) // fcmToken 없는 유저 제외
        const notificationOffUsers = userChatRoomInfos
            .filter(v => !v.notificated) // notificated false 상태인 유저로 필터링
            .filter(v => v.userId !== user.id) // 발신자 제외
            .filter(v => !!v.user.fcmToken) // fcmToken 없는 유저 제외

        try {
            // Notification On Users // 유음으로 보냄
            await userMessaging.sendMulticast({
                tokens: notificationOnUsers.map(v => v.user.fcmToken || ''),
                data: {
                    chatRoomId: chatRoom.id.toString(),
                    type: 'chat',
                },
                notification: {
                    title: user.name,
                    body: input.message || '사진',
                    imageUrl: user.image
                },
            })
            // Notification Off Users // 무음 메시지
            await userMessaging.sendMulticast({
                tokens: notificationOffUsers.map(v => v.user.fcmToken || ''),
                data: {
                    chatRoomId: chatRoom.id.toString(),
                    type: 'chat',
                },
                notification: {
                    title: user.name,
                    body: input.message || '사진',
                    imageUrl: user.image
                },
            })
        } catch (error) { console.log(error) }


        return chat
    }
}))