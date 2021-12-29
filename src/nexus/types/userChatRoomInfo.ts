import { objectType } from "nexus";

export const UserChatRoomInfo = objectType({
    name: 'UserChatRoomInfo',
    definition(t) {
        t.model.id()
        t.model.updatedAt()
        t.model.joinedAt()
        t.model.bookmarked()
        t.model.notificated()
        t.model.blocked()
        t.model.userId()
        t.model.chatRoomId()
        t.model.user()
        t.model.chatRoom()
        t.model.notReadChats()
        t.nonNull.int('notReadChatCount', {
            resolve: async ({ chatRoomId, userId }, { }, ctx) => {
                return ctx.prisma.chat.count({
                    where: {
                        chatRoomId,
                        notReadUserChatRoomInfos: { some: { userId } }
                    }
                })
            }
        })
    }
})