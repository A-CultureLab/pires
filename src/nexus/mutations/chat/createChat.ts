import { inputObjectType, mutationField, nonNull } from "nexus"
import getIUser from "../../../utils/getIUser"

import { userMessaging } from "../../../lib/firebase";
import { CHAT_CREATED, CHAT_ROOM_UPDATED } from "../../subscriptions";
import apolloError from "../../../utils/apolloError";
import dayjs from "dayjs";
import { messaging } from "firebase-admin";

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
                userChatRoomInfos: {
                    include: {
                        user: true,
                    }
                }
            }
        })

        if (!chatRoom) throw apolloError('유효하지 않은 채팅방입니다', 'INVALID_ID')

        const chatRoomUsers = chatRoom.userChatRoomInfos.map(v => v.user)
        const userChatRoomInfos = chatRoom.userChatRoomInfos

        // 해당 채팅방에 유저가 있는지 확인
        if (!chatRoomUsers.find(v => v.id === user.id)) throw apolloError('채팅방에 속해 있지 않습니다', 'NO_PERMISSION')


        if (chatRoom.type === 'private') {
            // 차단하거나 차단 당한 채팅이라면 오류
            if (!!userChatRoomInfos.find(v => v.blocked)) throw apolloError('차단된 채팅방입니다', 'NO_PERMISSION')
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

        const notReadUserInfos = userChatRoomInfos
            .filter(v => v.userId !== user.id) // 발신자 제외
            .filter(v => !!v.user.fcmToken) // fcmToken 없는 유저 제외

        for (const userInfo of notReadUserInfos) {
            try {
                const count = await ctx.prisma.chat.count({
                    where: {
                        notReadUserChatRoomInfos: { some: { userId: userInfo.user.id } }
                    }
                })
                await userMessaging.send({
                    token: userInfo.user.fcmToken || '',
                    data: {
                        chatRoomId: chatRoom.id.toString(),
                        chatId: chat.id,
                        type: 'chat',
                        title: user.name,
                        message: chat.message || '사진',
                        subText: dayjs(chat.createdAt).format('a h:mm'),
                        image: user.image,
                        notReadChatCount: count.toString() || '1',
                        notificated: userInfo.notificated ? 'true' : '',
                    },
                    android: {
                        notification: {
                            title: user.name,
                            body: chat.message || '사진',
                            channelId: userInfo.notificated ? 'chat' : 'chat_no_notificated',
                            priority: 'high',
                        }
                    },
                    apns: {
                        payload: {
                            aps: {
                                alert: {
                                    title: user.name,
                                    body: chat.message || '사진'
                                },
                                sound: userInfo.notificated ? 'true' : undefined,
                                badge: count,
                                threadId: chatRoom.id,
                                category: 'chat',
                                mutableContent: true,
                                contentAvailable: true
                            }
                        }
                    }
                })
            } catch (error: any) {
                console.log(error)
            }
        }


        return chat
    }
}))