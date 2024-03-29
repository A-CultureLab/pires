import { floatArg, mutationField, nonNull, nullable, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"

// 좌표를 주소로 전환
export const createReport = mutationField(t => t.nonNull.field('createReport', {
    type: 'Report',
    args: {
        userId: nullable(stringArg()),
        chatId: nullable(stringArg()),
        chatRoomId: nullable(stringArg()),
        reason: nonNull(stringArg())
    },
    resolve: async (_, { userId, chatId, chatRoomId, reason }, ctx) => {

        if ([userId, chatId, chatRoomId].filter(v => !!v).length !== 1) throw apolloError('신고 대상은 하나여야 합니다', 'INVALID_ARGS')

        return ctx.prisma.report.create({
            data: {
                reason,
                user: userId ? { connect: { id: userId } } : undefined,
                chat: chatId ? { connect: { id: chatId } } : undefined,
                chatRoom: chatRoomId ? { connect: { id: chatRoomId } } : undefined,
                reporter: { connect: { id: ctx.iUserId } }
            }
        })
    }
}))