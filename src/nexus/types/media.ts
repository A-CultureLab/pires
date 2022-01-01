import { objectType } from "nexus";
import apolloError from "../../utils/apolloError";

export const Media = objectType({
    name: 'Media',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.images()
        t.model.content()
        t.model.isInstagram()
        t.model.instagramKey()
        t.model.user()
        t.model.tagedPets()
        t.model.likedUsers()
        t.model.mediaComment()
        t.model.userId()
        t.nonNull.int('likeCount', {
            resolve: ({ id }, { }, ctx) => {
                return ctx.prisma.mediaLike.count({
                    where: { mediaId: id }
                })
            }
        })
        t.nonNull.int('commentCount', {
            resolve: async ({ id }, { }, ctx) => {
                const commentCount = await ctx.prisma.mediaComment.count({
                    where: { mediaId: id }
                })
                const replyCommentCount = await ctx.prisma.mediaReplyComment.count({
                    where: {
                        mediaComment: { mediaId: id }
                    }
                })
                return commentCount + replyCommentCount
            }
        })
        t.nonNull.list.nonNull.field('recentComments', {
            type: 'MediaComment',
            resolve: ({ id }, { }, ctx) => {
                return ctx.prisma.mediaComment.findMany({
                    where: { mediaId: id },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 2
                })
            }
        })
        t.nonNull.string('thumnail', {
            resolve: async ({ id }, { }, ctx) => {
                const image = await ctx.prisma.mediaImage.findFirst({
                    where: { mediaId: id },
                    orderBy: { orderKey: 'asc' }
                })
                if (!image) throw apolloError('미디어 이미지가 없습니다.', 'DB_ERROR', { notification: false })
                return image.url || ''
            }
        })
        t.nonNull.boolean('isILiked', {
            resolve: async ({ id }, _, ctx) => {
                const mediaLike = await ctx.prisma.mediaLike.findFirst({
                    where: {
                        userId: ctx.iUserId,
                        mediaId: id
                    }
                })
                return !!mediaLike
            }
        })
    }
})