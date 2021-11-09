import { objectType } from "nexus";

export const MediaReplyComment = objectType({
    name: 'MediaReplyComment',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.content()
        t.model.user()
        t.model.targetUser()
        t.model.mediaComment()
        t.model.userId()
        t.model.targetUserId()
        t.model.mediaCommentId()
    }
})