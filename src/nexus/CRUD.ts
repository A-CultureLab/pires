import { mutationType, queryType } from "nexus"

export const query = queryType({
    definition(t) {
        t.crud.chat()
        t.crud.user()
        t.crud.users({ filtering: true, pagination: true, ordering: true })
        t.crud.chatRoom()
        t.crud.pet()
        t.crud.pets({ filtering: true, pagination: true, ordering: true })
    }
})

export const mutation = mutationType({
    definition(t) {
        // Create
        // Update


        // Delete

    }
})
