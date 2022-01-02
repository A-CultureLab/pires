import { booleanArg, inputObjectType, mutationField, nonNull, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"

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


        return ctx.prisma.post.create({
            data: {
                ...data,
                images: { create: images.map(v => ({ url: v })) },
                user: { connect: { id: ctx.iUserId } }
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


        const prePost = await ctx.prisma.post.findUnique({
            where: { id }
        })

        if (prePost?.userId !== ctx.iUserId) throw apolloError("작성자만 수정할 수 있습니다.", "NO_PERMISSION")

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

        try {
            const post = await ctx.prisma.post.update({
                where: { id },
                data: {
                    likedUsers: {
                        connect: like ? { id: ctx.iUserId } : undefined,
                        disconnect: !like ? { id: ctx.iUserId } : undefined
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

        const post = await ctx.prisma.post.findUnique({
            where: { id: id }
        })

        if (!post) throw apolloError('유효하지 않은 게시물 ID 입니다', 'INVALID_ID')
        if (ctx.iUserId !== post?.userId) throw apolloError('삭제 권한 없음', 'NO_PERMISSION')

        // 이미지 삭제
        await ctx.prisma.postImage.deleteMany({
            where: { postId: id }
        })
        // 답글 삭제
        await ctx.prisma.postReplyComment.deleteMany({
            where: { postComment: { postId: id } }
        })
        // 댓글 삭제
        await ctx.prisma.postComment.deleteMany({
            where: { postId: id }
        })
        // 게시물 삭제
        return ctx.prisma.post.delete({
            where: { id }
        })
    }
}))