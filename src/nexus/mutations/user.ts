import { mutationField, nonNull, inputObjectType } from "nexus";
import { userAuth } from "../../lib/firebase";
import getIUser from "../../utils/getIUser";


export const SignupInput = inputObjectType({
    name: 'SignupInput',
    definition(t) {
        t.nonNull.string('email')
        t.nonNull.string('name')
        t.nonNull.string('image')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })
        t.nonNull.string('addressId')
        t.nonNull.string('address')
        t.nonNull.string('postcode')
        t.nonNull.float('latitude')
        t.nonNull.float('longitude')
        t.nullable.string('instagramId')
        t.nonNull.string('introduce')
        t.nonNull.field('agreementDate', { type: 'DateTime' })
        t.nullable.field('marketingPushDate', { type: 'DateTime' })
        t.nullable.field('marketingEmailDate', { type: 'DateTime' })
    }
})

export const signup = mutationField(t => t.nonNull.field('signup', {
    type: 'User',
    args: {
        data: nonNull(SignupInput)
    },
    resolve: async (_, { data }, ctx) => {
        // 토큰 가공
        let token = ctx.expressContext.req.headers.authorization
        if (!token) throw new Error('로그인이 필요한 작업입니다')
        token = token.replace('Bearer ', '')
        const { uid: id } = await userAuth.verifyIdToken(token)
        return ctx.prisma.user.create({
            data: {
                id,
                ...data
            }
        })
    }
}))

export const UpdateUserInput = inputObjectType({
    name: 'UpdateUserInput',
    definition(t) {
        t.nonNull.string('name')
        t.nonNull.string('image')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })
        t.nonNull.string('addressId')
        t.nonNull.string('address')
        t.nonNull.string('postcode')
        t.nonNull.float('latitude')
        t.nonNull.float('longitude')
        t.nullable.string('instagramId')
        t.nonNull.string('introduce')
    }
})

export const updateUser = mutationField(t => t.nonNull.field('updateUser', {
    type: 'User',
    args: {
        data: nonNull(UpdateUserInput)
    },
    resolve: async (_, { data }, ctx) => {
        const user = await getIUser(ctx)
        return ctx.prisma.user.update({
            where: { id: user.id },
            data
        })
    }
}))