import { intArg, nonNull, nullable, queryField, stringArg } from "nexus";
import chatRoomIdGenerator from "../../utils/chatRoomIdGenerator";

import getIUser from "../../utils/getIUser";
import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator";

export const chatRoom = queryField(t => t.nonNull.field('chatRoom', {
    type: 'ChatRoom',
    args: {
        id: nullable(stringArg()),
        userId: nullable(stringArg()) // private 전용
    },
    resolve: async (_, { id, userId }, ctx) => {
        const user = await getIUser(ctx)

        if (!id && !userId) throw new Error('"ChatRoomId"와 "UserId"중 하나는 있어야합니다.')


        if (userId) { // UserId로 접근했을때 chatRoom이 없다면 하나 생성해줌
            const chatRoomId = chatRoomIdGenerator.generate([user.id, userId])
            const chatRoom = await ctx.prisma.chatRoom.findUnique({ where: { id: chatRoomId } })
            if (chatRoom) return chatRoom
            // ChatRoom 생성
            const newChatRoom = await ctx.prisma.chatRoom.create({
                data: {
                    id: chatRoomIdGenerator.generate([user.id, userId]),
                    type: 'private',
                }
            })
            // UserChatRoomInfo 생성후 ChatRoomdp 연결
            for (const _userId of [user.id, userId]) {
                await ctx.prisma.userChatRoomInfo.create({
                    data: {
                        id: userChatRoomInfoIdGenerator.generate(newChatRoom.id, _userId),
                        user: { connect: { id: _userId }, },
                        chatRoom: { connect: { id: newChatRoom.id } }
                    }
                })
            }
            return newChatRoom
        }

        const chatRoom = await ctx.prisma.chatRoom.findUnique({ where: { id: id || '' } })
        if (!chatRoom) throw new Error('채팅방이 없습니다.')
        return chatRoom

    }
}))

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
                        joinedAt: { not: null } // 나가기 하지 않은 챗룸만 private 채팅에서만 유의미함
                    }
                },
                recentChatCreatedAt: { not: null }
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