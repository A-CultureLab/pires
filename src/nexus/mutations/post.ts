import { booleanArg, inputObjectType, mutationField, nonNull, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"
import getIUser from "../../utils/getIUser"

export const CreatePostInput = inputObjectType({
    name: 'CreatePostInput',
    definition(t) {
        t.nonNull.string('content')
        t.nonNull.field('type', { type: 'PostType' })
        t.nonNull.list.nonNull.string('images')
    }
})

export const createPost = mutationField(t => t.nonNull.field('createPost', {
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

export const UpdatePostInput = inputObjectType({
    name: 'UpdatePostInput',
    definition(t) {
        t.nonNull.string('id')
        t.nonNull.string('content')
        t.nonNull.field('type', { type: 'PostType' })
        t.nonNull.list.nonNull.string('images')
    }
})

export const updatePost = mutationField(t => t.nonNull.field('updatePost', {
    type: 'Post',
    args: {
        data: nonNull(UpdatePostInput)
    },
    resolve: async (_, { data: _data }, ctx) => {

        const { id, images, ...data } = _data

        const user = await getIUser(ctx)

        const prePost = await ctx.prisma.post.findUnique({
            where: { id }
        })

        if (prePost?.userId !== user.id) throw apolloError("작성자만 수정할 수 있습니다.", "NO_PERMISSION")

        // 기존의 이미지 삭제
        await ctx.prisma.postImage.deleteMany({
            where: { postId: id }
        })

        return ctx.prisma.post.update({
            where: { id },
            data: {
                ...data,
                images: { create: images.map(v => ({ url: v })) },
            }
        })
    }
}))

export const likePost = mutationField(t => t.nonNull.field('likePost', {
    type: 'Post',
    args: {
        id: nonNull(stringArg()),
        like: nonNull(booleanArg())
    },
    resolve: async (_, { like, id }, ctx) => {

        const user = await getIUser(ctx)
        try {
            const post = await ctx.prisma.post.update({
                where: { id },
                data: {
                    likedUsers: {
                        connect: like ? { id: user.id } : undefined,
                        disconnect: !like ? { id: user.id } : undefined
                    }
                }
            })

            return post
        } catch (error) {
            const post = await ctx.prisma.post.findUnique({ where: { id } })
            if (!post) throw apolloError('존재하지 않는 게시물입니다.', 'INVALID_ID')
            return post
        }
    }
}))

export const deletePost = mutationField(t => t.nonNull.field('deletePost', {
    type: 'Post',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const user = await getIUser(ctx)
        const post = await ctx.prisma.post.findUnique({
            where: { id: id }
        })

        if (!post) throw apolloError('유효하지 않은 게시물 ID 입니다', 'INVALID_ID')
        if (user.id !== post?.userId) throw apolloError('삭제 권한 없음', 'NO_PERMISSION')

        return ctx.prisma.post.delete({
            where: { id }
        })
    }
}))