import { objectType } from "nexus";

export const MediaComment = objectType({
    name: 'MediaComment',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.content()
        t.model.user()
        t.model.media()
        t.model.mediaReplyComment()
        t.model.userId()
        t.model.mediaId()
        t.nonNull.int('replyCommentCount', {
            resolve: ({ id }, { }, ctx) => {
                return ctx.prisma.mediaReplyComment.count({
                    where: { mediaCommentId: id }
                })
            }
        })
    }
})