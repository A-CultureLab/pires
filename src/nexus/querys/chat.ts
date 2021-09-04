import { intArg, nonNull, nullable, queryField, stringArg } from "nexus";
import chatRoomIdGenerator from "../../utils/chatRoomIdGenerator";

import getIUser from "../../utils/getIUser";
import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator";

export const chats = queryField(t => t.nonNull.list.nonNull.field('chats', {
    type: 'Chat',
    args: {
        chatRoomId: nonNull(stringArg()),
        cursor: nullable(stringArg()),
        take: nullable(intArg({ default: 20 }))
    },
    resolve: async (_, { chatRoomId, cursor, take }, ctx) => {

        const user = await getIUser(ctx)


        const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
            where: { id: userChatRoomInfoIdGenerator.generate(chatRoomId, user.id) }
        })

        if (!userChatRoomInfo) throw new Error('초대되지 않은 채팅방입니다.')

        const chats = await ctx.prisma.chat.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: take || undefined,
            where: {
                chatRoomId,
                createdAt: { gte: userChatRoomInfo.joinedAt || new Date() } // 채팅방에 참여한 이후의 채팅들만 보여줌
            },
            orderBy: { createdAt: 'desc' }
        })

        return chats
    }
}))