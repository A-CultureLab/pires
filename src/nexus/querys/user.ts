import { intArg, nonNull, nullable, queryField, stringArg } from "nexus"

// Query - 내 정보를 가져옴
export const iUser = queryField(t => t.nonNull.field('iUser', {
    type: 'User',
    resolve: async (_, { }, ctx) => {
        return ctx.iUser
    }
}))