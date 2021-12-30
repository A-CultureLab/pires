import { mutationField, nonNull, stringArg } from "nexus";
import apolloError from "../../utils/apolloError";

export const deleteMediaComment = mutationField(t => t.nonNull.field('deleteMediaComment', {
    type: 'Boolean',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const mediaComment = await ctx.prisma.mediaComment.findUnique({
            where: { id: id }
        })

        if (!mediaComment) throw apolloError('유효하지 않은 댓글의 ID 입니다', 'INVALID_ID')
        if (ctx.iUserId !== mediaComment?.userId) throw apolloError('삭제 권한 없음', 'NO_PERMISSION')

        await ctx.prisma.mediaReplyComment.deleteMany({
            where: { mediaCommentId: id }
        })

        await ctx.prisma.mediaComment.delete({
            where: { id }
        })

        return true
    }
}))