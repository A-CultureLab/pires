import { intArg, nonNull, nullable, queryField, stringArg } from "nexus";
import apolloError from "../../utils/apolloError";
import chatRoomIdGenerator from "../../utils/chatRoomIdGenerator";

import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator";

export const chatRoom = queryField(t => t.nonNull.field('chatRoom', {
    type: 'ChatRoom',
    args: {
        id: nullable(stringArg()),
        userId: nullable(stringArg()) // private 전용
    },
    resolve: async (_, { id, userId }, ctx) => {

        if (!id && !userId) throw apolloError('"ChatRoomId"와 "UserId"중 하나는 있어야합니다', 'INVALID_ARGS')


        if (userId) { // UserId로 접근했을때 chatRoom이 없다면 하나 생성해줌
            const chatRoomId = chatRoomIdGenerator.generate([ctx.iUserId, userId])
            const chatRoom = await ctx.prisma.chatRoom.findUnique({ where: { id: chatRoomId } })
            if (chatRoom) return chatRoom
            // ChatRoom 생성
            const newChatRoom = await ctx.prisma.chatRoom.create({
                data: {
                    id: chatRoomIdGenerator.generate([ctx.iUserId, userId]),
                    type: 'private',
                }
            })
            // UserChatRoomInfo 생성후 ChatRoomdp 연결
            for (const _userId of [ctx.iUserId, userId]) {
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


        if (!chatRoom) throw apolloError('유효하지 않은 채팅방입니다', 'INVALID_ID')

        const notReadChats = await ctx.prisma.chat.findMany({
            where: {
                chatRoom: { id: chatRoom.id },
                notReadUserChatRoomInfos: { some: { userId: ctx.iUserId } }
            },
            select: { id: true }
        })

        // 안읽음 메시지 삭제
        await ctx.prisma.userChatRoomInfo.update({
            where: { id: userChatRoomInfoIdGenerator.generate(chatRoom.id, ctx.iUserId) },
            data: {
                notReadChats: { disconnect: notReadChats }
            }
        })

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

        const chatRooms = await ctx.prisma.chatRoom.findMany({
            where: {
                userChatRoomInfos: {
                    some: {
                        userId: ctx.iUserId,
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