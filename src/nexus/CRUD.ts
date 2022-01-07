import { mutationType, queryType } from "nexus"

export const query = queryType({
    definition(t) {
        t.nonNull.crud.user()
        t.nonNull.crud.pet()
        t.nonNull.crud.chat()
        t.nonNull.crud.post()
        t.nonNull.crud.mediaComment()
        t.nonNull.crud.postComment()
        t.nonNull.crud.postComments({ ordering: true, pagination: true, filtering: true })
        t.nonNull.crud.postReplyComments({ ordering: true, pagination: true, filtering: true })
        t.nonNull.crud.mediaComments({ ordering: true, pagination: true, filtering: true })
        t.nonNull.crud.mediaReplyComments({ ordering: true, pagination: true, filtering: true })
    }
})

export const mutation = mutationType({
    definition(t) {
        // Create
        t.nonNull.crud.createOnePostComment()
        t.nonNull.crud.createOnePostReplyComment()
        t.nonNull.crud.createOneMediaComment()
        t.nonNull.crud.createOneMediaReplyComment()
        // Update
        t.nonNull.crud.updateOnePost()
        // Delete
    }
})
