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
        t.nonNull.int('postReplyCommentCount', {
            resolve: ({ id }, { }, ctx) => {
                return ctx.prisma.postReplyComment.count({
                    where: { postCommentId: id }
                })
            }
        })
        t.nonNull.list.nonNull.field('recentPostReplyComments', {
            type: 'PostReplyComment',
            resolve: ({ id }, { }, ctx) => {
                return ctx.prisma.postReplyComment.findMany({
                    where: { postCommentId: id },
                    orderBy: { content: 'desc' },
                    take: 3
                })
            }
        })
    }
})