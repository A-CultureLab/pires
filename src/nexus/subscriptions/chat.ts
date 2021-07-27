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
            console.log('filter')
            console.log(payload)
            // const { id } = await getIUser(ctx)
            const id = 'KAKAO:1818675922'
            const chatRoom = await ctx.prisma.chatRoom.findUnique({
                where: { id: payload.chatRoomId },
                include: { users: true }
            })
            console.log(chatRoom)
            console.log((chatRoom?.users || []).filter(v => v.id === id).length !== 0)
            return (chatRoom?.users || []).filter(v => v.id === id).length !== 0
        }
    ),
    resolve: (payload: Chat) => {
        console.log('res')
        console.log(payload)
        return payload
    }
})