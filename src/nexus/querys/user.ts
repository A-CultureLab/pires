import axios from "axios"
import { intArg, nonNull, nullable, queryField, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"
import getIUser from "../../utils/getIUser"

// Query - 내 정보를 가져옴
export const iUser = queryField(t => t.nonNull.field('iUser', {
    type: 'User',
    resolve: async (_, { }, ctx) => {
        const user = await getIUser(ctx)
        return user
    }
}))