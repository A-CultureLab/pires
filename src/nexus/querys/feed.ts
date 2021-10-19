import { intArg, nullable, objectType, queryField } from "nexus"
import { PostsAdressFilterInput } from "../types"
import arrayShuffle from 'array-shuffle';



export const Feed = objectType({
    name: 'Feed',
    definition(t) {
        t.nonNull.string('id')
        t.nullable.field('post', { type: 'Post' })
        t.nullable.field('news', { type: 'News' })
    }
})

export const feeds = queryField(t => t.nonNull.list.nonNull.field('feeds', {
    type: Feed,
    args: {
        filter: nullable(PostsAdressFilterInput),
        take: nullable(intArg({ default: 10 })),
        skipPost: nullable(intArg({ default: 0 })),
        skipNews: nullable(intArg({ default: 0 }))
    },
    resolve: async (_, { filter, take, skipPost, skipNews }, ctx) => {

        const posts = await ctx.prisma.post.findMany({
            where: filter ? {
                user: {
                    address: {
                        area1Id: filter.area1Id || undefined,
                        area2Id: filter.area2Id || undefined,
                        area3Id: filter.area3Id || undefined,
                        landId: filter.landId || undefined
                    }
                }
            } : undefined,
            orderBy: { createdAt: 'desc' },
            take: take ? take - 3 : 0,
            skip: skipPost || 0
        })

        const news = await ctx.prisma.news.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: take ? take - posts.length : 0,
            skip: skipNews || 0
        })


        const data = arrayShuffle([
            ...posts.map(post => ({ id: post.id, post })),
            ...news.map(v => ({ id: v.id, news: v }))
        ])


        return data
    }
}))