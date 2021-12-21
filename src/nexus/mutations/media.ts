import { inputObjectType, list, mutationField, nonNull, stringArg } from "nexus"

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


