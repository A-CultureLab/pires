import { Chat, User } from "@prisma/client";
import { withFilter } from "apollo-server-express";
import { nonNull, stringArg, subscriptionField } from "nexus";
import { Context } from "../../context";
import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator";

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
            ctx.iUserId = userId
            ctx.iUser = await ctx.prisma.user.findUnique({ where: { id: userId } }) as User
            //  해당 챗룸만 
            return payload.chatRoomId === chatRoomId
        }
    ),
    resolve: async (payload: Chat, { }, ctx) => {
        const notReadChats = await ctx.prisma.chat.findMany({
            where: {
                chatRoomId: payload.chatRoomId,
                notReadUserChatRoomInfos: { some: { userId: ctx.iUserId } }
            },
            select: {
                id: true
            }
        })
        // 않읽은 메시지 삭제
        await ctx.prisma.userChatRoomInfo.update({
            where: { id: userChatRoomInfoIdGenerator.generate(payload.chatRoomId, ctx.iUserId) },
            data: {
                notReadChats: { disconnect: notReadChats }
            }
        })


        return payload
    }
})


export const CHAT_UPDATED = 'CHAT_UPDATED'

// ChatDetailScreen 에 사용됨
export const chatUpdated = subscriptionField('chatUpdated', {
    type: 'Chat',
    args: {
        userId: nonNull(stringArg()),
        chatRoomId: nonNull(stringArg())
    },
    subscribe: withFilter(
        (_, { }, ctx: Context) => ctx.pubsub.asyncIterator(CHAT_UPDATED),
        async (payload: Chat, { userId, chatRoomId }, ctx: Context) => {
            ctx.iUserId = userId
            ctx.iUser = await ctx.prisma.user.findUnique({ where: { id: userId } }) as User
            //  해당 챗룸만 
            return payload.chatRoomId === chatRoomId
        }
    ),
    resolve: async (payload: Chat, { }, ctx) => {
        return payload
    }
})