import { Chat } from "@prisma/client";
import { withFilter } from "apollo-server-express";
import { nonNull, stringArg, subscriptionField } from "nexus";
import { Context } from "../../context";
import getIUser from "../../utils/getIUser";

export const CHAT_CREATED = 'CHAT_CREATED'


export const chatCreated = subscriptionField('chatCreated', {
    type: 'Chat',
    subscribe: withFilter(
        (_, { }, ctx: Context) => ctx.pubsub.asyncIterator(CHAT_CREATED),
        async (payload: Chat, { }, ctx: Context) => {
            const { id } = await getIUser(ctx)

            const chatRoom = await ctx.prisma.chatRoom.findUnique({
                where: { id: payload.chatRoomId },
                include: { users: true }
            })

            return (chatRoom?.users || []).filter(v => v.id === id).length !== 0
        }
    ),
    resolve: async (payload: Chat, { }, ctx) => {

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

        // 안읽음 메시지 삭제
        await ctx.prisma.user.update({
            where: { id: user.id },
            data: {
                notReadChats: { disconnect: notReadChats }
            }
        })

        return payload
    }
})