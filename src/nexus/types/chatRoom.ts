import { objectType } from "nexus";
import chatRoomIdGenerator from "../../utils/chatRoomIdGenerator";
import getIUser from "../../utils/getIUser";
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
        t.nonNull.boolean('isIBlocked', { // 내가 차단한 채팅방인가?
            resolve: async ({ id, type }, { }, ctx) => {
                if (type === 'group') return false

                const user = await getIUser(ctx)
                const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
                    where: { id: userChatRoomInfoIdGenerator.generate(id, user.id) },
                })

                return userChatRoomInfo?.blocked || false
            }
        })
        t.nonNull.boolean('isBlockedMe', { // 내가 차단 당한 채팅방인가
            resolve: async ({ id, type }, { }, ctx) => {
                if (type === 'group') return false

                const user = await getIUser(ctx)
                const userIds = chatRoomIdGenerator.parse(id)
                const otherUserId = userIds[0] === user.id ? userIds[1] : userIds[0]

                const otherUserChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
                    where: { id: userChatRoomInfoIdGenerator.generate(id, otherUserId) },
                })
                return otherUserChatRoomInfo?.blocked || false
            }
        })
        t.nullable.field('recentChat', {
            type: 'Chat',
            resolve: async ({ id }, { }, ctx) => {
                const user = await getIUser(ctx)

                const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({
                    where: { id: userChatRoomInfoIdGenerator.generate(id, user.id) }
                })

                if (!userChatRoomInfo) throw new Error('No UserChatRoominfo')

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
                const user = await getIUser(ctx)
                const users = await ctx.prisma.user.findMany({
                    where: {
                        userChatRoomInfos: { some: { chatRoomId: id } },
                        withdrawDate: type === 'group' ? null : undefined,
                        id: { not: user.id }
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
                const user = await getIUser(ctx)
                const users = await ctx.prisma.user.findMany({
                    where: {
                        userChatRoomInfos: { some: { chatRoomId: id } },
                        withdrawDate: type === 'group' ? null : undefined,
                        id: { not: user.id }
                    },
                    orderBy: {
                        name: 'asc',
                    },
                    select: {
                        image: true
                    },
                    take: 1
                })

                return users[0].image
            }
        })
        t.nonNull.field('iUserChatRoomInfo', {
            type: 'UserChatRoomInfo',
            resolve: async ({ id }, { }, ctx) => {
                const user = await getIUser(ctx)
                const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.findFirst({
                    where: {
                        userId: user.id,
                        chatRoomId: id
                    }
                })

                if (!userChatRoomInfo) throw new Error

                return userChatRoomInfo
            }
        })
    }
})