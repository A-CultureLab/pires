import { intArg, nonNull, nullable, queryField } from "nexus";

import getIUser from "../../utils/getIUser";

export const chats = queryField(t => t.nonNull.list.nonNull.field('chats', {
    type: 'Chat',
    args: {
        chatRoomId: nonNull(intArg()),
        cursor: nullable(intArg()),
        take: nullable(intArg({ default: 20 }))
    },
    resolve: async (_, { cursor, chatRoomId, take }, ctx) => {

        const user = await getIUser(ctx)

        const notReadChats = await ctx.prisma.chat.findMany({
            where: {
                chatRoomId,
                notReadUsers: { some: { id: user.id } }
            },
            select: { id: true }
        })

        // 안읽음 메시지 삭제
        await ctx.prisma.user.update({
            where: { id: user.id },
            data: {
                notReadChats: { disconnect: notReadChats }
            }
        })

        const chats = await ctx.prisma.chat.findMany({
            cursor: cursor ? { id: cursor } : undefined,
            take: take || undefined,
            where: { chatRoomId },
            orderBy: { createdAt: 'desc' }
        })

        return chats
    }
}))