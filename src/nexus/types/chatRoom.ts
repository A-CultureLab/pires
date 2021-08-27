import { objectType } from "nexus";
import getIUser from "../../utils/getIUser";

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
        t.field('recentChat', {
            type: 'Chat',
            resolve: async ({ id }, { }, ctx) => {
                return ctx.prisma.chat.findFirst({
                    where: { chatRoomId: id },
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