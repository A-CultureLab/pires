import { CHAT_CREATED, CHAT_ROOM_UPDATED } from "../subscriptions";
import { inputObjectType, mutationField, nonNull } from "nexus";

import getIUser from "../../utils/getIUser";
import { userMessaging } from "../../lib/firebase";

const CreateChatInput = inputObjectType({
    name: 'CreateChatInput',
    definition(t) {
        t.nonNull.int('chatRoomId')
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

        chat.chatRoom.users.filter(v => v.id !== user.id).forEach((v) => {
            if (!v.fcmToken) return
            userMessaging.send({
                token: v.fcmToken,
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
        })


        return chat
    }
}))