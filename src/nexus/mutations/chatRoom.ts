import { booleanArg, mutationField, nonNull, stringArg } from "nexus"
import getIUser from "../../utils/getIUser"

export const updateChatRoomNotification = mutationField(t => t.nonNull.field('updateChatRoomNotification', {
    type: 'ChatRoom',
    args: {
        id: nonNull(stringArg()),
        isOn: nonNull(booleanArg())
    },
    resolve: async (_, { id, isOn }, ctx) => {

        const user = await getIUser(ctx)
        // 유저가 챗룸에 있는지 조회
        const preChatRoom = await ctx.prisma.chatRoom.findUnique({
            where: { id },
            include: {
                notificatedUsers: { where: { id: user.id } },
                users: { where: { id: user.id } }
            }
        })
        if (!preChatRoom) throw new Error('No ChatRoom')
        if (preChatRoom.users.length === 0) throw new Error('Access Deny')
        const preChatRoomNotificationIsOn = preChatRoom.notificatedUsers.length === 1
        const isSame = isOn === preChatRoomNotificationIsOn


        const chatRoom = await ctx.prisma.chatRoom.update({
            where: { id },
            data: {
                notificatedUsers: !isSame ? {
                    connect: !preChatRoomNotificationIsOn ? { id: user.id } : undefined,
                    disconnect: preChatRoomNotificationIsOn ? { id: user.id } : undefined
                } : undefined
            }
        })

        return chatRoom
    }
}))