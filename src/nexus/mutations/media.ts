import { inputObjectType, list, mutationField, nonNull, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"

export const CreateMediaInput = inputObjectType({
    name: 'CreateMediaInput',
    definition(t) {
        t.nonNull.string('content')
        t.nonNull.list.nonNull.string('imageUrls')
        t.nonNull.list.nonNull.string('taggedPetIds')
    }
})

export const createMedia = mutationField(t => t.nonNull.field('createMedia', {
    type: 'Media',
    args: {
        input: nonNull(CreateMediaInput)
    },
    resolve: async (_, { input }, ctx) => {

        const { content, imageUrls, taggedPetIds } = input

        const media = await ctx.prisma.media.create({
            data: {
                content,
                images: {
                    createMany: { data: imageUrls.map((url, orderKey) => ({ url, orderKey })) }
                },
                user: { connect: { id: ctx.iUserId } },
                tagedPets: { connect: taggedPetIds.map(id => ({ id })) }
            }
        })
        return media
    }
}))

export const updateMedia = mutationField(t => t.nonNull.field('updateMedia', {
    type: 'Media',
    args: {
        id: nonNull(stringArg()),
        input: nonNull(CreateMediaInput)
    },
    resolve: async (_, { id, input }, ctx) => {
        const { content, imageUrls, taggedPetIds } = input

        const media = await ctx.prisma.media.findUnique({ where: { id } })

        if (!media) throw apolloError('존재하지 않는 게시물', 'INVALID_ID')
        if (media.userId !== ctx.iUserId) throw apolloError('수정권한 없음', 'NO_PERMISSION')

        // 기존 데이터 삭제
        await Promise.all([
            ctx.prisma.mediaImage.deleteMany({ where: { mediaId: id } }), // 이미지 삭제
            ctx.prisma.media.update({ where: { id }, data: { tagedPets: { set: [] } } }) // 테그된 동물삭제
        ])

        return ctx.prisma.media.update({
            where: { id },
            data: {
                content,
                images: {
                    createMany: { data: imageUrls.map((url, orderKey) => ({ url, orderKey })) }
                },
                tagedPets: { connect: taggedPetIds.map(id => ({ id })) }
            }
        })
    }
}))


export const likeMedia = mutationField(t => t.nonNull.field('likeMedia', {
    type: 'Media',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {
        const mediaLike = await ctx.prisma.mediaLike.findFirst({
            where: {
                userId: ctx.iUserId,
                mediaId: id
            }
        })
        if (!!mediaLike) throw apolloError('이미 좋아요를 누른 게시물입니다.', 'DB_ERROR')

        return ctx.prisma.media.update({
            where: { id },
            data: {
                likedUsers: {
                    create: {
                        user: { connect: { id: ctx.iUserId } }
                    }
                }
            }
        })
    }
}))

export const disLikeMedia = mutationField(t => t.nonNull.field('disLikeMedia', {
    type: 'Media',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {
        const mediaLike = await ctx.prisma.mediaLike.findFirst({
            where: {
                userId: ctx.iUserId,
                mediaId: id
            }
        })
        if (!mediaLike) throw apolloError('이미 좋아요를 해제한 게시물입니다.', 'DB_ERROR')

        return ctx.prisma.media.update({
            where: { id },
            data: {
                likedUsers: {
                    delete: {
                        id: mediaLike.id
                    }
                }
            }
        })
    }
}))


export const deleteMedia = mutationField(t => t.nonNull.field('deleteMedia', {
    type: 'Media',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const media = await ctx.prisma.media.findUnique({
            where: { id: id }
        })

        if (!media) throw apolloError('유효하지 않은 게시물 ID 입니다', 'INVALID_ID')
        if (media.userId !== ctx.iUserId) throw apolloError('삭제 권한 없음', 'NO_PERMISSION')

        // 이미지 삭제
        await ctx.prisma.mediaImage.deleteMany({
            where: { mediaId: id }
        })
        // 답글 삭제
        await ctx.prisma.mediaReplyComment.deleteMany({
            where: { mediaComment: { mediaId: id } }
        })
        // 댓글 삭제
        await ctx.prisma.mediaComment.deleteMany({
            where: { mediaId: id }
        })
        // 좋아요 삭제
        await ctx.prisma.mediaLike.deleteMany({
            where: { mediaId: id }
        })


        // 게시물 삭제
        return ctx.prisma.media.delete({
            where: { id }
        })
    }
}))
