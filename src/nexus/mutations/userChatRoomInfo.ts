import { inputObjectType, mutationField, nonNull, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"

const updateUserChatRoomInfoInput = inputObjectType({
    name: 'UpdateUserChatRoomInfoInput',
    definition: (t) => {
        t.nonNull.string('id')
        t.nullable.boolean('notificated')
        t.nullable.boolean('bookmarked')
        t.nullable.boolean('blocked')
    }
})

export const updateUserChatRoomInfo = mutationField(t => t.nonNull.field('updateUserChatRoomInfo', {
    type: 'UserChatRoomInfo',
    args: {
        input: nonNull(updateUserChatRoomInfoInput)
    },
    resolve: async (_, { input }, ctx) => {
        const { id, notificated, bookmarked, blocked } = input

        const preUserChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({ where: { id } })

        if (preUserChatRoomInfo?.userId !== ctx.iUserId) throw apolloError('채팅방 수정 권한 없음', 'NO_PERMISSION')

        const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.update({
            where: { id },
            data: {
                notificated: notificated !== null ? notificated : undefined,
                bookmarked: bookmarked !== null ? bookmarked : undefined,
                blocked: blocked !== null ? blocked : undefined,
            }
        })

        return userChatRoomInfo
    }
}))