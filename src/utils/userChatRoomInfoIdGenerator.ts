import apolloError from "./apolloError"

const SIMBOL = '@%@%'

const generate = (chatRoomId: string, userId: string): string => {
    return chatRoomId + SIMBOL + userId
}

const parse = (userChatRoomInfoId: string) => {
    const splitedId = userChatRoomInfoId.split(SIMBOL)

    if (splitedId.length !== 2) throw apolloError('유효하지 않은 유저의 채팅방 정보', 'INVALID_ID')

    const chatRoomId = splitedId[0]
    const userId = splitedId[1]

    return {
        chatRoomId,
        userId
    }
}


export default {
    generate,
    parse
}