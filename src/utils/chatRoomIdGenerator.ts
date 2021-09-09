import apolloError from "./apolloError"

const SIMBOL = '@%@%'

const generate = (userIds: string[]): string => {
    if (userIds.length !== 2) throw apolloError('1:1채팅이 아닙니다', 'INVALID_ARGS')
    userIds.sort()
    return userIds[0] + SIMBOL + userIds[1]
}

const parse = (chatRoomId: string) => {
    const userIds = chatRoomId.split(SIMBOL)

    if (userIds.length !== 2) throw apolloError('유효하지 않은 채팅방 아이디', 'INVALID_ID')

    return userIds
}


export default {
    generate,
    parse
}