import { objectType } from "nexus";
import getIUser from "../../utils/getIUser";

export const ChatRoom = objectType({
    name: 'ChatRoom',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.recentChatCreatedAt()
        t.model.users()
        t.model.chats()
        t.field('recentChat', {
            type: 'Chat',
            resolve: async ({ id }, { }, ctx) => {
                return ctx.prisma.chat.findFirst({
                    where: { chatRoomId: id },
                    orderBy: { createdAt: 'desc' }
                })
            }
        })
        t.nonNull.int('notReadChatCount', {
            resolve: async ({ id }, { }, ctx) => {
                const user = await getIUser(ctx)
                return ctx.prisma.chat.count({
                    where: {
                        chatRoomId: id,
                        notReadUsers: { some: { id: user.id } }
                    }
                })
            }
        })
        t.nonNull.string('name', {
            resolve: async ({ id }, { }, ctx) => {
                const user = await getIUser(ctx, true)
                const users = await ctx.prisma.user.findMany({
                    where: { chatRooms: { some: { id } } }
                })
                return users.filter(v => v.id !== user?.id).map(v => v.name).join(', ')
            }
        })
    }
})