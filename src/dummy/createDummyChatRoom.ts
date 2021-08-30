import { ChatRoomType } from "@prisma/client"
import { prisma } from "../context"
import userChatRoomInfoIdGenerator from "../utils/userChatRoomInfoIdGenerator"

const TYPE: ChatRoomType = 'private'
const USER_IDS = ['KAKAO:1800305740', 'KAKAO:1828988879']

const createDummyChatRoom = async () => {
    const chatRoom = await prisma.chatRoom.create({
        data: {
            type: TYPE,
        }
    })
    for (const userId of USER_IDS) {
        await prisma.userChatRoomInfo.create({
            data: {
                id: userChatRoomInfoIdGenerator.generate(chatRoom.id, userId),
                user: { connect: { id: userId }, },
                chatRoom: { connect: { id: chatRoom.id } }
            }
        })
    }

}

createDummyChatRoom()