import axios from "axios"
import { intArg, nonNull, nullable, objectType, queryField, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"


export const MediaAndInstagramMedia = objectType({
    name: 'MediaAndInstagramMedia',
    definition(t) {
        t.nonNull.string('id')
        t.nullable.string('instagramEndCursor')
        t.nonNull.string('thumnail')
        t.nonNull.field('media', { type: 'Media' })
    }
})

export const mediasByUserId = queryField(t => t.nonNull.list.nonNull.field('mediasByUserId', {
    type: MediaAndInstagramMedia,
    args: {
        userId: nonNull(stringArg()),
        instagramEndCursor: nullable(stringArg()), // 인스타그램 전용 커서 <- 난수 키라서 파싱 불가능
        endCursor: nullable(stringArg()) // mediaId
    },
    resolve: async (_, { userId, instagramEndCursor, endCursor }, ctx) => {

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
                'variables': `{"id":"${instagramId}","first":15, "after":"${instagramEndCursor || ''}"}`
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'User-Agent': 'Mozilla',
                'Cookie': `sessionid=${process.env.INSTA_SESSION_ID}; Path=/; Domain=.instagram.com;`
            },
            withCredentials: true
        })

        const instagramMedias = await Promise.all(instagramMediaData.data.user.edge_owner_to_timeline_media.edges.map(async (v: any) => {
            const media =
                await ctx.prisma.media.findUnique({ where: { id: v.node.id } })
                ||
                await ctx.prisma.media.create({
                    data: {
                        id: v.node.id,
                        createdAt: new Date(v.node.taken_at_timestamp),
                        content: '',
                        isInstagram: true,
                        images: { create: { orderKey: 0, url: v.node.thumbnail_resources[2].src } },
                        user: { connect: { id: userId } }
                    }
                })

            return {
                id: v.node.id,
                instagramEndCursor: instagramMediaData.data.user.edge_owner_to_timeline_media?.page_info?.end_cursor || undefined,
                thumnail: v.node.thumbnail_resources[2].src,
                media
            }
        }))

        const userMediaData = await ctx.prisma.media.findMany({
            where: { userId, isInstagram: false },
            orderBy: { createdAt: 'desc' },
            include: { images: { orderBy: { orderKey: 'asc' } } },
            take: 15,
            cursor: !!endCursor ? { id: endCursor } : undefined,
            skip: !!endCursor ? 1 : 0
        })
        const userMedias = userMediaData.map((v) => ({
            id: v.id,
            thumnail: v.images[0].url,
            media: v
        }))

        const sortedMedias = [...instagramMedias, ...userMedias]
            .sort((a, b) => new Date(b.media.createdAt).getTime() - new Date(a.media.createdAt).getTime())
            .slice(0, 15)
        return sortedMedias

    }
}))


export const mediasByPetId = queryField(t => t.nonNull.list.nonNull.field('mediasByPetId', {
    type: 'Media',
    args: {
        petId: nonNull(stringArg()),
        take: nullable(intArg({ default: 15 })),
        skip: nullable(intArg({ default: 0 }))
    },
    resolve: (_, { petId, take, skip }, ctx) => {
        return ctx.prisma.media.findMany({
            where: {
                tagedPets: { some: { id: petId } },
                isInstagram: false
            },
            orderBy: { createdAt: 'desc' },
            take: take || 0,
            skip: skip || 0
        })
    }
}))