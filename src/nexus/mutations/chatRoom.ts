import { mutationField, nonNull, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"
import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator"

export const exitChatRoom = mutationField(t => t.nonNull.field('exitChatRoom', {
    type: 'ChatRoom',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const preChatRoom = await ctx.prisma.chatRoom.findUnique({
            where: { id },
            include: {
                userChatRoomInfos: {
                    select: {
                        user: {
                            select: { id: true }
                        }
                    }
                }
            }
        })

        if (!preChatRoom) throw apolloError('유효하지 않은 채팅방 아이디', 'INVALID_ID')
        if (!preChatRoom.userChatRoomInfos.map(({ user: { id } }) => id).includes(ctx.iUserId)) throw apolloError('이미 채팅방에서 나왔습니다', 'NO_PERMISSION') // 방에 없다면 에러

        if (preChatRoom.type === 'private') {
            await ctx.prisma.userChatRoomInfo.update({
                where: { id: userChatRoomInfoIdGenerator.generate(id, ctx.iUserId) },
                data: { joinedAt: null }
            })
        }
        else if (preChatRoom.type === 'group') {
            await ctx.prisma.userChatRoomInfo.delete({
                where: { id: userChatRoomInfoIdGenerator.generate(id, ctx.iUserId) },
            })
        }

        const chatRoom = await ctx.prisma.chatRoom.findUnique({ where: { id } })

        if (!chatRoom) throw apolloError('유효하지 않은 채팅방 아이디', 'INVALID_ID')
        return chatRoom
    }
}))


