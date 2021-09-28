import { ChatRoomType } from "@prisma/client"
import { prisma } from "../context"
import chatRoomIdGenerator from "../utils/chatRoomIdGenerator"
import userChatRoomInfoIdGenerator from "../utils/userChatRoomInfoIdGenerator"

const TYPE: ChatRoomType = 'group' as ChatRoomType
// const USER_IDS = ['KAKAO:1800305740', 'KAKAO:1828988879'] // S10E IOS Simulator
// const USER_IDS = ['KAKAO:1828988879', 'KAKAO:1811116444', 'KAKAO:1812587783'] // 
// const USER_IDS = ['KAKAO:1812587783', 'KAKAO:1828988879']
const USER_IDS = ['KAKAO:1828988879', 'QtFUSiQqVyehfn5I9sfUd93TX8J3', '002033a6-696c-4a04-83b5-8741aa90791b', '005ce7fa-c519-4918-a660-b8880299ca61', '0061021e-cacd-4948-8ede-d0121854b37c', '0063b37f-b0c5-4d72-9eeb-01a51427e18c']

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