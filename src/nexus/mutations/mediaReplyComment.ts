import { mutationField, nonNull, stringArg } from "nexus";
import apolloError from "../../utils/apolloError";

export const deleteMediaReplyComment = mutationField(t => t.nonNull.field('deleteMediaReplyComment', {
    type: 'MediaComment',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const mediaReplyComment = await ctx.prisma.mediaReplyComment.findUnique({
            where: { id: id },
            include: {
                mediaComment: true
            }
        })

        if (!mediaReplyComment) throw apolloError('유효하지 않은 답글의 ID 입니다', 'INVALID_ID')
        if (ctx.iUserId !== mediaReplyComment?.userId) throw apolloError('삭제 권한 없음', 'NO_PERMISSION')

        await ctx.prisma.mediaReplyComment.delete({
            where: { id }
        })
        return mediaReplyComment.mediaComment
    }
}))