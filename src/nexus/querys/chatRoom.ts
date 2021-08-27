import { intArg, nonNull, nullable, queryField, stringArg } from "nexus";

import getIUser from "../../utils/getIUser";

export const chatRooms = queryField(t => t.nonNull.list.nonNull.field('chatRooms', {
    type: 'ChatRoom',
    args: {
        cursor: nullable(stringArg()),
        take: nullable(intArg({ default: 20 }))
    },
    resolve: async (_, { cursor, take }, ctx) => {

        const user = await getIUser(ctx)

        const chatRooms = await ctx.prisma.chatRoom.findMany({
            where: {
                userChatRoomInfos: {
                    some: {
                        userId: user.id,
                        exitedAt: null // 나가기 하지 않은 챗룸만 private 채팅에서만 유의미함
                    }
                },
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