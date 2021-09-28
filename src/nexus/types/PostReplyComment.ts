import { objectType } from "nexus";

export const PostReplyComment = objectType({
    name: 'PostReplyComment',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.content()
        t.model.image()
        t.model.user()
        t.model.postComment()
        t.model.userId()
        t.model.postCommentId()
    }
})