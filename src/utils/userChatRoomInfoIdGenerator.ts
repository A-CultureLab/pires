const SIMBOL = '@%@%'

const generate = (chatRoomId: string, userId: string): string => {
    return chatRoomId + SIMBOL + userId
}

const parse = (userChatRoomInfoId: string) => {
    const splitedId = userChatRoomInfoId.split(SIMBOL)

    if (splitedId.length !== 2) throw new Error('Invalid \"userChatRoomInfoId\"')

    const addressKey = splitedId[0]
    const addressId = splitedId[1]

    return {
        addressKey,
        addressId
    }
}


export default {
    generate,
    parse
}