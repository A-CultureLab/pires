import { objectType } from "nexus";
import apolloError from "../../utils/apolloError";
import chatRoomIdGenerator from "../../utils/chatRoomIdGenerator";
import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator";

export const ChatRoom = objectType({
    name: 'ChatRoom',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.recentChatCreatedAt()
        t.model.type()
        t.model.chats()
        t.model.userChatRoomInfos()
        t.model.reports()
        t.nonNull.boolean('isIBlocked', { // 내가 차단한 채팅방인가?
            resolve: async ({ id, type }, { }, ctx) => {
                if (type === 'group') return false

                const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
                    where: { id: userChatRoomInfoIdGenerator.generate(id, ctx.iUserId) },
                })

                return userChatRoomInfo?.blocked || false
            }
        })
        t.nonNull.boolean('isBlockedMe', { // 내가 차단 당한 채팅방인가
            resolve: async ({ id, type }, { }, ctx) => {
                if (type === 'group') return false

                const userIds = chatRoomIdGenerator.parse(id)
                const otherUserId = userIds[0] === ctx.iUserId ? userIds[1] : userIds[0]

                const otherUserChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
                    where: { id: userChatRoomInfoIdGenerator.generate(id, otherUserId) },
                })
                return otherUserChatRoomInfo?.blocked || false
            }
        })
        t.nullable.field('recentChat', {
            type: 'Chat',
            resolve: async ({ id }, { }, ctx) => {
                const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
                    where: { id: userChatRoomInfoIdGenerator.generate(id, ctx.iUserId) }
                })

                if (!userChatRoomInfo) throw apolloError('유효하지 않은 채팅방', 'INVALID_ID')

                return ctx.prisma.chat.findFirst({
                    where: {
                        chatRoomId: id,
                        createdAt: { gte: userChatRoomInfo.joinedAt || new Date() }
                    },
                    orderBy: { createdAt: 'desc' }
                })
            }
        })
        t.nonNull.string('name', {
            resolve: async ({ id, type }, { }, ctx) => {
                const users = await ctx.prisma.user.findMany({
                    where: {
                        userChatRoomInfos: { some: { chatRoomId: id } },
                        withdrawDate: type === 'group' ? null : undefined,
                        id: { not: ctx.iUserId }
                    },
                    orderBy: {
                        name: 'asc',
                    },
                    select: {
                        name: true
                    },
                    take: 10
                })

                return users
                    .map(v => v.name)
                    .join(', ')
            }
        })
        t.nonNull.string('image', {
            resolve: async ({ id, type }, { }, ctx) => {
                const users = await ctx.prisma.user.findMany({
                    where: {
                        userChatRoomInfos: { some: { chatRoomId: id } },
                        withdrawDate: type === 'group' ? null : undefined,
                        id: { not: ctx.iUserId }
                    },
                    orderBy: {
                        name: 'asc',
                    },
                    select: {
                        image: true
                    },
                    take: 1
                })

                return users[0].image || ''
            }
        })
        t.nonNull.field('iUserChatRoomInfo', {
            type: 'UserChatRoomInfo',
            resolve: async ({ id }, { }, ctx) => {
                const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findFirst({
                    where: {
                        userId: ctx.iUserId,
                        chatRoomId: id
                    }
                })

                if (!userChatRoomInfo) throw apolloError('유효하지 않은 유저의 채팅방 정보', 'INVALID_ID')

                return userChatRoomInfo
            }
        })
    }
})