import { mutationType, queryType } from "nexus"

export const query = queryType({
    definition(t) {
        t.nonNull.crud.user()
        t.nonNull.crud.pet()
    }
})

export const mutation = mutationType({
    definition(t) {
        // Create
        // Update
        // Delete
    }
})
