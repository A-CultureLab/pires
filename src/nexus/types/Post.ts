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
        t.nullable.float('distance', {
            resolve: async ({ userId }, { }, ctx) => {
                const iUser = await getIUser(ctx, true)
                if (!iUser) return null
                const writer = await ctx.prisma.user.findUnique({
                    where: { id: userId },
                    include: {
                        address: {
                            include: { land: true }
                        }
                    }
                })
                const user = await ctx.prisma.user.findUnique({
                    where: { id: iUser.id },
                    include: {
                        address: {
                            include: { land: true }
                        }
                    }
                })
                if (!writer) return null
                if (!user) return null

                const meter = haversineDistance({
                    latitude: writer.address.land.latitude,
                    longitude: writer.address.land.longitude
                }, {
                    latitude: user.address.land.latitude,
                    longitude: user.address.land.longitude
                })

                return meter
            }
        })
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