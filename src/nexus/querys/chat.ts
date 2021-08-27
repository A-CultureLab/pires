import { intArg, nonNull, nullable, queryField, stringArg } from "nexus";

import getIUser from "../../utils/getIUser";
import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator";

export const chats = queryField(t => t.nonNull.list.nonNull.field('chats', {
    type: 'Chat',
    args: {
        chatRoomId: nonNull(stringArg()),
        cursor: nullable(stringArg()),
        take: nullable(intArg({ default: 20 }))
    },
    resolve: async (_, { cursor, chatRoomId, take }, ctx) => {

        const user = await getIUser(ctx)

        const notReadChats = await ctx.prisma.chat.findMany({
            where: {
                chatRoomId,
                notReadUserChatRoomInfos: { some: { userId: user.id } }
            },
            select: { id: true }
        })

        // 안읽음 메시지 삭제
        await ctx.prisma.userChatRoomInfo.update({
            where: { id: userChatRoomInfoIdGenerator.generate(chatRoomId, user.id) },
            data: {
                notReadChats: { disconnect: notReadChats }
            }
        })

        const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
            where: { id: userChatRoomInfoIdGenerator.generate(chatRoomId, user.id) }
        })

        if (!userChatRoomInfo) throw new Error('No Permission')

        const chats = await ctx.prisma.chat.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: take || undefined,
            where: {
                chatRoomId,
                createdAt: { gte: userChatRoomInfo.joinedAt } // 채팅방에 참여한 이후의 채팅들만 보여줌
            },
            orderBy: { createdAt: 'desc' }
        })

        return chats
    }
}))