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
        t.model.inflow()
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
        t.model.chats()
        t.model.userChatRoomInfos()
        t.model.reports()
        t.model.myReports()
        t.nonNull.int('notReadChatCount', {
            resolve: async ({ id }, { }, ctx) => {
                return await ctx.prisma.chat.count({
                    where: {
                        notReadUserChatRoomInfos: { some: { userId: id } }
                    }
                })
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