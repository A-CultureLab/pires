import { intArg, nonNull, nullable, queryField, stringArg } from "nexus";

export const followers = queryField(t => t.nonNull.list.nonNull.field('followers', {
    type: 'Follow',
    args: {
        userId: nonNull(stringArg()),
        take: nullable(intArg({ default: 20 })),
        skip: nullable(intArg({ default: 0 }))
    },
    resolve: async (_, { userId, take, skip }, ctx) => {
        return ctx.prisma.follow.findMany({
            where: {
                targetUserId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: take || 0,
            skip: skip || 0
        })
    }
}))


export const followings = queryField(t => t.nonNull.list.nonNull.field('followings', {
    type: 'Follow',
    args: {
        userId: nonNull(stringArg()),
        take: nullable(intArg({ default: 20 })),
        skip: nullable(intArg({ default: 0 }))
    },
    resolve: async (_, { userId, take, skip }, ctx) => {
        return ctx.prisma.follow.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: take || 0,
            skip: skip || 0
        })
    }
}))