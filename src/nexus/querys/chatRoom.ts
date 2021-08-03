import { intArg, nonNull, nullable, queryField } from "nexus";

import getIUser from "../../utils/getIUser";

export const chatRooms = queryField(t => t.nonNull.list.nonNull.field('chatRooms', {
    type: 'ChatRoom',
    args: {
        cursor: nullable(intArg()),
        take: nullable(intArg({ default: 20 }))
    },
    resolve: async (_, { cursor, take }, ctx) => {

        const user = await getIUser(ctx)

        const chatRooms = await ctx.prisma.chatRoom.findMany({
            where: {
                users: { some: { id: user.id } }
            },
            take: take || undefined,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                recentChatCreatedAt: 'desc'
            }
        })

        return chatRooms
    }
}))