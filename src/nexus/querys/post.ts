import { inputObjectType, intArg, nonNull, nullable, queryField, stringArg } from "nexus"
import { PostsAdressFilterInput } from "../types"


export const posts = queryField(t => t.nonNull.list.nonNull.field('posts', {
    type: 'Post',
    args: {
        filter: nullable(PostsAdressFilterInput),
        take: nullable(intArg({ default: 10 })),
        skip: nullable(intArg({ default: 0 }))
    },
    resolve: async (_, { filter, skip, take }, ctx) => {
        return ctx.prisma.post.findMany({
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
            take: take || 0,
            skip: skip || 0
        })
    }
}))