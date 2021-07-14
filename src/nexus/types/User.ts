import { objectType } from "nexus";

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.email()
        t.model.name()
        t.model.image()
        t.model.gender()
        t.model.birth()
        t.model.addressId()
        t.model.address()
        t.model.postcode()
        t.model.latitude()
        t.model.longitude()
        t.model.instagramId()
        t.model.introduce()
        t.model.agreementDate()
        t.model.marketingPushDate()
        t.model.marketingEmailDate()
        t.model.pets()
        t.model.chatRooms()
        t.model.chats()
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