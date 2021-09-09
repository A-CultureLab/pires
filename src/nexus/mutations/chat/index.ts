import { CHAT_CREATED, CHAT_ROOM_UPDATED, CHAT_UPDATED } from "../../subscriptions";
import { inputObjectType, mutationField, nonNull, stringArg } from "nexus";

import getIUser from "../../../utils/getIUser";
import apolloError from "../../../utils/apolloError";

export * from './createChat'

export const deleteChat = mutationField(t => t.nonNull.field('deleteChat', {
    type: 'Chat',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const user = await getIUser(ctx)
        const preChat = await ctx.prisma.chat.findUnique({ where: { id } })

        if (!preChat) throw apolloError('유효하지 않은 채팅입니다', 'INVALID_ID')
        if (preChat.userId !== user.id) throw apolloError('삭제할 권한이 없습니다', 'NO_PERMISSION')

        const chat = await ctx.prisma.chat.update({
            where: { id },
            data: {
                isDeleted: true,
            },
            include: {
                chatRoom: true
            }
        })

        ctx.pubsub.publish(CHAT_UPDATED, chat)
        ctx.pubsub.publish(CHAT_ROOM_UPDATED, chat.chatRoom)

        return chat
    }
}))