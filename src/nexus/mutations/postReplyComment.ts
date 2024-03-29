import { mutationField, nonNull, stringArg } from "nexus";
import apolloError from "../../utils/apolloError";

export const deletePostReplyComment = mutationField(t => t.nonNull.field('deletePostReplyComment', {
    type: 'PostReplyComment',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const postReplyComment = await ctx.prisma.postReplyComment.findUnique({
            where: { id: id }
        })

        if (!postReplyComment) throw apolloError('유효하지 않은 답글의 ID 입니다', 'INVALID_ID')
        if (ctx.iUserId !== postReplyComment?.userId) throw apolloError('삭제 권한 없음', 'NO_PERMISSION')

        return ctx.prisma.postReplyComment.delete({
            where: { id }
        })
    }
}))