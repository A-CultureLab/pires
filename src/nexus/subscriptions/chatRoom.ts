import { Chat, ChatRoom, User } from "@prisma/client";
import { withFilter } from "apollo-server-express";
import { nonNull, stringArg, subscriptionField } from "nexus";
import { Context } from "../../context";

export const CHAT_ROOM_UPDATED = 'CHAT_ROOM_UPDATED'

// ChatScreen에 사용됨
export const chatRoomUpdated = subscriptionField('chatRoomUpdated', {
    type: 'ChatRoom',
    args: {
        userId: nonNull(stringArg())
    },
    subscribe: withFilter(
        (_, { }, ctx: Context) => ctx.pubsub.asyncIterator(CHAT_ROOM_UPDATED),
        async (payload: ChatRoom, { userId }, ctx: Context) => {

            ctx.iUserId = userId // trick TODO
            ctx.iUser = await ctx.prisma.user.findUnique({ where: { id: userId } }) as User

            const chatRoom = await ctx.prisma.chatRoom.findUnique({
                where: { id: payload.id },
                include: { userChatRoomInfos: { include: { user: true } } }
            })

            return (chatRoom?.userChatRoomInfos.map(v => v.user) || []).filter(v => v.id === userId).length !== 0
        }
    ),
    resolve: async (payload: ChatRoom, { }, ctx) => {
        return payload
    }
})