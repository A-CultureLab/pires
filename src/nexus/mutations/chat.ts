import { inputObjectType, mutationField, nonNull } from "nexus";
import getIUser from "../../utils/getIUser";
import { CHAT_CREATED, CHAT_ROOM_UPDATED } from "../subscriptions";

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

        const user = { id: 'KAKAO:1818675922' }

        const chatRoom = await ctx.prisma.chatRoom.findUnique({
            where: { id: input.chatRoomId },
            include: {
                users: true,
            }
        })

        if (!chatRoom?.users.find(v => v.id !== user.id)) throw new Error('no Permission')


        const chat = await ctx.prisma.chat.create({
            data: {
                chatRoom: { connect: { id: input.chatRoomId } },
                message: input.message || undefined,
                image: input.message || undefined,
                user: { connect: { id: user.id } },
                notReadUsers: { connect: chatRoom.users.filter(v => v.id !== user.id).map(v => ({ id: v.id })) }
            },
            include: {
                chatRoom: true
            }
        })

        ctx.pubsub.publish(CHAT_CREATED, chat)
        ctx.pubsub.publish(CHAT_ROOM_UPDATED, chatRoom)

        return chat
    }
}))