import { Chat, ChatRoom } from "@prisma/client";
import { withFilter } from "apollo-server-express";
import { nonNull, stringArg, subscriptionField } from "nexus";
import { Context } from "../../context";
import getIUser from "../../utils/getIUser";

export const CHAT_ROOM_UPDATED = 'CHAT_ROOM_UPDATED'

// ChatScreen에 사용됨
export const chatRoomUpdated = subscriptionField('chatRoomUpdated', {
    type: 'Chat',
    args: {
        userId: nonNull(stringArg())
    },
    subscribe: withFilter(
        (_, { }, ctx: Context) => ctx.pubsub.asyncIterator(CHAT_ROOM_UPDATED),
        async (payload: ChatRoom, { userId }, ctx: Context) => {
            console.log('chatRoomUpdated')

            ctx.userId = userId // trick TODO
            const user = await getIUser(ctx)

            const chatRoom = await ctx.prisma.chatRoom.findUnique({
                where: { id: payload.id },
                include: { users: true }
            })

            return (chatRoom?.users || []).filter(v => v.id === user.id).length !== 0
        }
    ),
    resolve: async (payload: Chat, { }, ctx) => {
        console.log('chatroom reslove')
        return payload
    }
})