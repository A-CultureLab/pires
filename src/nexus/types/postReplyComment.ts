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
        t.nonNull.boolean('isPoster', {
            resolve: async ({ postCommentId, userId }, _, ctx) => {
                const postComment = await ctx.prisma.postComment.findUnique({
                    where: { id: postCommentId },
                    include: {
                        post: true
                    }
                })
                if (!postComment) throw new Error("isPoster")
                return postComment.post.userId === userId
            }
        })
    }
})