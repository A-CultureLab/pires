import { Chat } from "@prisma/client";
import { withFilter } from "apollo-server-express";
import { nonNull, stringArg, subscriptionField } from "nexus";
import { Context } from "../../context";
import getIUser from "../../utils/getIUser";

export const CHAT_CREATED = 'CHAT_CREATED'

// ChatDetailScreen 에 사용됨
export const chatCreated = subscriptionField('chatCreated', {
    type: 'Chat',
    args: {
        userId: nonNull(stringArg()),
        chatRoomId: nonNull(stringArg())
    },
    subscribe: withFilter(
        (_, { }, ctx: Context) => ctx.pubsub.asyncIterator(CHAT_CREATED),
        async (payload: Chat, { userId, chatRoomId }, ctx: Context) => {
            console.log('chatCreated')

            if (payload.chatRoomId !== chatRoomId) return false

            ctx.userId = userId
            const user = await getIUser(ctx)

            const chatRoom = await ctx.prisma.chatRoom.findUnique({
                where: { id: payload.chatRoomId },
                include: { users: true }
            })
            return (chatRoom?.users || []).filter(v => v.id === user.id).length !== 0
        }
    ),
    resolve: async (payload: Chat, { }, ctx) => {
        console.log('reslove')

        const user = await getIUser(ctx)

        const notReadChats = await ctx.prisma.chat.findMany({
            where: {
                chatRoomId: payload.chatRoomId,
                notReadUsers: { some: { id: user.id } }
            },
            select: {
                id: true
            }
        })

        await ctx.prisma.user.update({
            where: { id: user.id },
            data: {
                notReadChats: { disconnect: notReadChats }
            }
        })

        return payload
    }
})