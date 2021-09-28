import { inputObjectType, mutationField, nonNull } from "nexus"
import getIUser from "../../utils/getIUser"

export const CreatePostInput = inputObjectType({
    name: 'CreatePostInput',
    definition(t) {
        t.nonNull.string('content')
        t.nonNull.field('type', { type: 'PostType' })
        t.nonNull.list.nonNull.string('images')
    }
})

export const createPost = mutationField(t => t.field('createPost', {
    type: 'Post',
    args: {
        data: nonNull(CreatePostInput)
    },
    resolve: async (_, { data: _data }, ctx) => {

        const { images, ...data } = _data

        const user = await getIUser(ctx)

        return ctx.prisma.post.create({
            data: {
                ...data,
                images: { create: images.map(v => ({ url: v })) },
                user: { connect: { id: user.id } }
            }
        })
    }
}))