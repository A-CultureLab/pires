import { objectType } from "nexus";
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
            resolve: async ({ id }, { }, ctx) => {
                const user = await getIUser(ctx, true)
                const users = await ctx.prisma.user.findMany({
                    where: { userChatRoomInfos: { some: { chatRoomId: id } } }
                })
                return users.filter(v => v.id !== user?.id).map(v => v.name).join(', ')
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