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



