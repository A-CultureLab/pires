import { CHAT_CREATED, CHAT_ROOM_UPDATED } from "../../subscriptions";
import { inputObjectType, mutationField, nonNull, stringArg } from "nexus";

import getIUser from "../../../utils/getIUser";

export * from './createChat'

export const deleteChat = mutationField(t => t.nonNull.field('deleteChat', {
    type: 'Chat',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const user = await getIUser(ctx)
        const preChat = await ctx.prisma.chat.findUnique({ where: { id } })

        if (!preChat) throw new Error('Invalid Chat Id')
        if (preChat.userId !== user.id) throw new Error('No Permission')

        const chat = await ctx.prisma.chat.update({
            where: { id },
            data: {
                isDeleted: true,
            }
        })

        return chat
    }
}))