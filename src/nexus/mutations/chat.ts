import { inputObjectType, mutationField, nonNull } from "nexus";
import getIUser from "../../utils/getIUser";
import { CHAT_CREATED } from "../subscriptions";

const CreateChatInput = inputObjectType({
    name: 'CreateChatInput',
    definition(t) {
        t.nonNull.int('chatRoomId')
        t.nullable.string('message')
        t.nullable.string('image')
    }
})

export const createChat = mutationField(t => t.nonNull.field('createChat', {
    type: 'Chat',
    args: {
        input: nonNull(CreateChatInput)
    },
    resolve: async (_, { input }, ctx) => {

        // const { id } = await getIUser(ctx)

        const chat = await ctx.prisma.chat.create({
            data: {
                chatRoom: { connect: { id: input.chatRoomId } },
                message: input.message || undefined,
                image: input.message || undefined,
                user: { connect: { id: 'KAKAO:1818675922' } }
            }
        })
        await ctx.pubsub.publish(CHAT_CREATED, chat)
        return chat
    }
}))