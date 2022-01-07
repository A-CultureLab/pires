import apolloError from "./apolloError"

const SIMBOL = '@%@%'

const generate = (userId: string, instagramId: string): string => {
    return userId + SIMBOL + instagramId
}

const parse = (id: string) => {
    const parsed = id.split(SIMBOL)

    if (parsed.length !== 2) throw apolloError('유효하지 않은 인스타그램 게시물', 'INVALID_ID')

    return {
        userId: parsed[0],
        instagramId: parsed[1]
    }
}


export default {
    generate,
    parse
}