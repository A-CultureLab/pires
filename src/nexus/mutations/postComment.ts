import { mutationField, nonNull, stringArg } from "nexus";
import apolloError from "../../utils/apolloError";
import getIUser from "../../utils/getIUser";

export const deletePostComment = mutationField(t => t.nonNull.field('deletePostComment', {
    type: 'PostComment',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const user = await getIUser(ctx)
        const postComment = await ctx.prisma.postComment.findUnique({
            where: { id: id }
        })

        if (!postComment) throw apolloError('유효하지 않은 댓글의 ID 입니다', 'INVALID_ID')
        if (user.id !== postComment?.userId) throw apolloError('삭제 권한 없음', 'NO_PERMISSION')

        await ctx.prisma.postReplyComment.deleteMany({
            where: { postCommentId: id }
        })

        return ctx.prisma.postComment.delete({
            where: { id }
        })
    }
}))