import { inputObjectType, mutationField, nonNull, stringArg } from "nexus"
import getIUser from "../../utils/getIUser"

const updateUserChatRoomInfoInput = inputObjectType({
    name: 'UpdateUserChatRoomInfoInput',
    definition: (t) => {
        t.nonNull.string('id')
        t.nullable.boolean('notificated')
        t.nullable.boolean('bookmarked')
    }
})

export const updateUserChatRoomInfo = mutationField(t => t.nonNull.field('updateUserChatRoomInfo', {
    type: 'UserChatRoomInfo',
    args: {
        input: nonNull(updateUserChatRoomInfoInput)
    },
    resolve: async (_, { input }, ctx) => {
        const { id, notificated, bookmarked } = input

        const preUserChatRoomInfo = await ctx.prisma.userChatRoomInfo.findUnique({ where: { id } })
        const user = await getIUser(ctx)

        if (preUserChatRoomInfo?.userId !== user.id) throw new Error('No Permission')

        console.log(input)

        const userChatRoomInfo = await ctx.prisma.userChatRoomInfo.update({
            where: { id },
            data: {
                notificated: notificated !== null ? notificated : undefined,
                bookmarked: bookmarked !== null ? bookmarked : undefined,
            }
        })

        return userChatRoomInfo
    }
}))