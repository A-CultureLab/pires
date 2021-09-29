import haversineDistance from "haversine-distance";
import { objectType } from "nexus";
import getIUser from "../../utils/getIUser";

export const Post = objectType({
    name: 'Post',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.type()
        t.model.content()
        t.model.user()
        t.model.images()
        t.model.likedUsers()
        t.model.notificatedUsers()
        t.model.comments()
        t.model.userId()
        t.nonNull.int('commentCount', {
            resolve: async ({ id }, { }, ctx) => {
                const commentCount = await ctx.prisma.postComment.count({
                    where: { postId: id }
                })
                const replyCommentCount = await ctx.prisma.postReplyComment.count({
                    where: { postComment: { postId: id } }
                })
                return commentCount + replyCommentCount
            }
        })
    }
})