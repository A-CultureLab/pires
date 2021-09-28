import { objectType } from "nexus";

export const PostComment = objectType({
    name: 'PostComment',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.content()
        t.model.image()
        t.model.user()
        t.model.post()
        t.model.replyComments()
        t.model.postId()
        t.model.userId()
    }
})