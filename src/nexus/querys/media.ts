import axios from "axios"
import { inputObjectType, intArg, booleanArg, nullable, objectType, queryField, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"



export const InstagramMedia = objectType({
    name: 'InstagramMedia',
    definition: (t) => {
        t.nonNull.string('id')
        t.nonNull.string('image')
    }
})

export const MediaAndInstagramMedia = objectType({
    name: 'MediaAndInstagramMedia',
    definition(t) {
        t.nonNull.string('id')
        t.nullable.string('instagramEndCursor')
        t.nullable.field('instagramMedia', { type: InstagramMedia })
    }
})

export const mediasByUserId = queryField(t => t.nonNull.list.nonNull.field('mediasByUserId', {
    type: MediaAndInstagramMedia,
    args: {
        userId: nullable(stringArg()),
        instagramEndCursor: nullable(stringArg()), // 인스타그램 전용 커서 <- 해시 키라서 파싱 불가능
    },
    resolve: async (_, { userId, instagramEndCursor }, ctx) => {

        if (instagramEndCursor === null) return [] // 최초 요청시 undifined 끝에 도달시 null

        const user = await ctx.prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw apolloError('유효하지 않은 유저 입니다', 'INVALID_ID')
        if (!user.instagramId) throw apolloError('인스타그램 아이디가 없는 유저', 'INVALID_ID', { notification: false, log: false })

        const { data: instagramUserData } = await axios.get(`https://www.instagram.com/${user.instagramId}/?__a=1`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'User-Agent': 'Mozilla',
                'Cookie': `sessionid=${process.env.INSTA_SESSION_ID}; Path=/; Domain=.instagram.com;`
            },
            withCredentials: true
        })
        if (!instagramUserData?.graphql?.user) throw apolloError('잘 못된 인스타그램 아이디', 'INVALID_ID', { notification: false })
        const instagramId = instagramUserData.graphql.user.id

        const { data: instagramMediaData } = await axios.get(`https://www.instagram.com/graphql/query`, {
            params: {
                'query_hash': '472f257a40c653c64c666ce877d59d2b',
                'variables': `{"id":"${instagramId}","first":12, "after":"${instagramEndCursor || ''}"}`
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'User-Agent': 'Mozilla',
                'Cookie': `sessionid=${process.env.INSTA_SESSION_ID}; Path=/; Domain=.instagram.com;`
            },
            withCredentials: true
        })

        return instagramMediaData.data.user.edge_owner_to_timeline_media.edges.map((v: any) => (
            {
                id: v.node.id,
                instagramEndCursor: instagramMediaData.data.user.edge_owner_to_timeline_media?.page_info?.end_cursor || undefined,
                instagramMedia: {
                    id: v.node.id,
                    image: v.node.thumbnail_src,
                }
            }
        ))
    }
}))