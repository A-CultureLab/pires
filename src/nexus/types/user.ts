import { objectType } from "nexus";

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.email()
        t.model.uniqueKey()
        t.model.name()
        t.model.image()
        t.model.gender()
        t.model.birth()
        t.model.instagramId()
        t.model.introduce()
        t.model.agreementDate()
        t.model.marketingPushDate()
        t.model.marketingEmailDate()
        t.model.withdrawDate()
        t.model.fcmToken()
        t.model.withdrawReason()
        t.model.addressId()
        t.model.address()
        t.model.pets()
        t.model.chatRooms()
        t.model.chats()
        t.model.notReadChats()
        t.model.notificatedChatRooms()
        t.model.bookmarkedChatRoom()
        t.model.iBlockedUsers()
        t.model.blockMeUsers()
        t.nonNull.int('notReadChatCount', {
            resolve: async ({ id }, { }, ctx) => {
                const user = await ctx.prisma.user.findUnique({
                    where: { id },
                    include: {
                        _count: {
                            select: {
                                notReadChats: true
                            }
                        }
                    }
                })
                return user?._count?.notReadChats || 0
            }
        })
        t.nonNull.int('age', {
            resolve: ({ birth }, { }, ctx) => {
                const today = new Date()
                const birthDate = new Date(birth)

                const age = today.getFullYear() - birthDate.getFullYear() + 1
                return age
            }
        })
    }
})