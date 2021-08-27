import { CHAT_CREATED, CHAT_ROOM_UPDATED } from "../subscriptions";
import { inputObjectType, mutationField, nonNull, stringArg } from "nexus";

import getIUser from "../../utils/getIUser";
import { userMessaging } from "../../lib/firebase";

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

        // const user = { id: 'KAKAO:1818675922', name: 'hello', image: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg' }
        const user = await getIUser(ctx)

        const chatRoom = await ctx.prisma.chatRoom.findUnique({
            where: { id: input.chatRoomId },
            include: {
                users: true,
            }
        })

        if (!chatRoom?.users.find(v => v.id !== user.id)) throw new Error('no Permission')


        const chat = await ctx.prisma.chat.create({
            data: {
                chatRoom: { connect: { id: input.chatRoomId } },
                message: input.message || undefined,
                image: input.image || undefined,
                user: { connect: { id: user.id } },
                notReadUsers: { connect: chatRoom.users.filter(v => v.id !== user.id).map(v => ({ id: v.id })) }
            },
            include: {
                chatRoom: {
                    include: {
                        notificatedUsers: true,
                        users: true
                    }
                },
            }
        })

        await ctx.prisma.chatRoom.update({
            where: { id: chat.chatRoomId },
            data: { recentChatCreatedAt: chat.createdAt }
        })

        ctx.pubsub.publish(CHAT_CREATED, chat)
        ctx.pubsub.publish(CHAT_ROOM_UPDATED, chatRoom)

        const notificationOnUsers = chat.chatRoom.notificatedUsers
            .filter(v => v.id !== user.id) // 발신자 제외
            .filter(v => !!v.fcmToken) // fcmToken 없는 유저 제외
        const notificationOffUsers = chat.chatRoom.users
            .filter(v => !notificationOnUsers.find((u) => v.id === u.id)) // 알림 ON인 유저 제외
            .filter(v => v.id !== user.id) // 발신자 제외
            .filter(v => !!v.fcmToken) // FCMToken 없는 유저 제외

        try {
            // Notification On Users // 유음으로 보냄
            await userMessaging.sendMulticast({
                tokens: notificationOnUsers.map(v => v.fcmToken || ''),
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
                tokens: notificationOffUsers.map(v => v.fcmToken || ''),
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

export const deleteChat = mutationField(t => t.nonNull.field('deleteChat', {
    type: 'Chat',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const user = await getIUser(ctx)
        const preChat = await ctx.prisma.chat.findUnique({ where: { id } })

        if (!preChat) throw new Error('Invalid Chat Id')
        if (preChat.userId !== user.id) throw new Error('No Permission')

        const chat = await ctx.prisma.chat.update({
            where: { id },
            data: {
                isDeleted: true,
                message: '삭제된 메시지',
                image: null
            }
        })

        return chat
    }
}))