import { ChatRoomType } from "@prisma/client"
import { prisma } from "../context"
import chatRoomIdGenerator from "../utils/chatRoomIdGenerator"
import userChatRoomInfoIdGenerator from "../utils/userChatRoomInfoIdGenerator"

const TYPE: ChatRoomType = 'group' as ChatRoomType
// const USER_IDS = ['KAKAO:1800305740', 'KAKAO:1828988879'] // S10E IOS Simulator
const USER_IDS = ['KAKAO:1800305740', 'KAKAO:1828988879', 'GgcurqRJ0dgB5qig0plVdCs4dGl2', 'KAKAO:1811116444', 'KAKAO:1812587783'] // 

const createDummyChatRoom = async () => {
    const chatRoom = await prisma.chatRoom.create({
        data: {
            id: TYPE === 'private' ? chatRoomIdGenerator.generate(USER_IDS) : undefined,
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

// createDummyChatRoom()