const SIMBOL = '@%@%'

const generate = (userIds: string[]): string => {
    if (userIds.length !== 2) throw new Error('This ChatRoom Is Not Private Type')
    userIds.sort()
    return userIds[0] + SIMBOL + userIds[1]
}

const parse = (chatRoomId: string) => {
    const userIds = chatRoomId.split(SIMBOL)

    if (userIds.length !== 2) throw new Error('Invalid \"chatRoomId\"')

    return userIds
}


export default {
    generate,
    parse
}