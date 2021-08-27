import { ChatRoom } from "@prisma/client"
import { mutationField, nonNull, stringArg } from "nexus"
import getIUser from "../../utils/getIUser"
import userChatRoomInfoIdGenerator from "../../utils/userChatRoomInfoIdGenerator"

export const exitChatRoom = mutationField(t => t.nonNull.field('exitChatRoom', {
    type: 'ChatRoom',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {

        const user = await getIUser(ctx)
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

        if (!preChatRoom) throw new Error('Invalid ChatRoom Id')
        if (!preChatRoom.userChatRoomInfos.map(({ user: { id } }) => id).includes(user.id)) throw new Error('No Permission') // 방에 없다면 에러

        if (preChatRoom.type === 'private') {
            await ctx.prisma.userChatRoomInfo.update({
                where: { id: userChatRoomInfoIdGenerator.generate(id, user.id) },
                data: { joinedAt: null }
            })
        }
        else if (preChatRoom.type === 'group') {
            await ctx.prisma.userChatRoomInfo.delete({
                where: { id: userChatRoomInfoIdGenerator.generate(id, user.id) },
            })
        }

        const chatRoom = await ctx.prisma.chatRoom.findUnique({ where: { id } })

        if (!chatRoom) throw new Error('No ChatRoom')
        return chatRoom
    }
}))

