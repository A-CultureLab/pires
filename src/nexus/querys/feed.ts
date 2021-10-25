import { intArg, nullable, objectType, queryField } from "nexus"
import { PostsAdressFilterInput } from "../types"
import arrayShuffle from 'array-shuffle';
import { News, Post } from ".prisma/client";



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


        const data: { id: string, post?: Post, news?: News }[] = []

        let postCount = 0
        let newsCount = 0

        for (let i = 0; i < posts.length + news.length; i++) {
            const pushPost = () => {
                data.push({ id: posts[postCount].id, post: posts[postCount] })
                postCount++
            }
            const pushNews = () => {
                data.push({ id: news[newsCount].id, news: news[newsCount] })
                newsCount++
            }

            if (postCount === posts.length) pushNews()
            else if (newsCount === news.length) pushPost()
            else if (postCount >= 2 && !!data[i - 1].post && !!data[i - 2].post) pushNews() // 앞에 두게가 포스트라면 뉴스 하나 추가
            else pushPost()

        }

        return data
    }
}))