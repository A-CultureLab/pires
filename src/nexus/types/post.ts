import haversineDistance from "haversine-distance";
import { inputObjectType, objectType } from "nexus";
import getIUser from "../../utils/getIUser";

export const PostsAdressFilterInput = inputObjectType({
    name: 'PostsAdressFilterInput',
    definition(t) {
        t.nullable.string('area1Id')
        t.nullable.string('area2Id')
        t.nullable.string('area3Id')
        t.nullable.string('landId')
    }
})

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
        t.nonNull.int('likeCount', {
            resolve: async ({ id }, { }, ctx) => {
                return ctx.prisma.user.count({
                    where: { likedPosts: { some: { id } } }
                })
            }
        })
        t.nonNull.boolean('isILiked', {
            resolve: async ({ id }, { }, ctx) => {
                const user = await getIUser(ctx, true)
                if (!user) return false
                const post = await ctx.prisma.post.findUnique({
                    where: { id },
                    include: {
                        likedUsers: {
                            where: { id: user.id }
                        }
                    }
                })
                if (!post) return false
                return !!post.likedUsers.length
            }
        })
    }
})