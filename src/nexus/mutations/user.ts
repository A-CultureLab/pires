import { mutationField, nonNull, inputObjectType, stringArg } from "nexus";
import { userAuth } from "../../lib/firebase";
import getIUser from "../../utils/getIUser";
import { v4 } from 'uuid';
import axios from "axios";

export const SignupInput = inputObjectType({
    name: 'SignupInput',
    definition(t) {
        t.nonNull.string('email')
        t.nonNull.string('image')

        t.nonNull.string('uniqueKey')
        t.nonNull.string('name')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })

        t.nonNull.string('addressPostcode')
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
                ...data,
                addressPostcode: undefined,
                address: { connect: { postcode: data.addressPostcode } }
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
        t.nonNull.string('addressPostcode')
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
            data: {
                ...data,
                addressPostcode: undefined,
                address: data.addressPostcode ? { connect: { postcode: data.addressPostcode } } : undefined
            }
        })
    }
}))

export const withdraw = mutationField(t => t.nonNull.field('withdraw', {
    type: 'User',
    args: {
        reason: nonNull(stringArg())
    },
    resolve: async (_, { reason }, ctx) => {
        const user = await getIUser(ctx)

        // 반려동물 삭제
        await ctx.prisma.pet.deleteMany({
            where: { userId: user.id }
        })
        // 유저 정보 더미데이터로 덮어씌우기
        const updatedUser = await ctx.prisma.user.update({
            where: { id: user.id },
            data: {
                id: 'deleted:' + v4(),
                name: '탈퇴한 사용자',
                image: 'https://static.thenounproject.com/png/574748-200.png',
                withdrawDate: new Date(),
                withdrawReason: reason,
                birth: new Date(),
                email: 'deleted:' + v4(),
                uniqueKey: 'deleted:' + v4(),
                address: { disconnect: true },
                fcmToken: null
            }
        })
        // 파이어베이스 유저 삭제
        await userAuth.deleteUser(user.id)

        // 카카오 로그인이라면 연결 해제
        if (user.id.includes('KAKAO')) {
            try {
                await axios.post("https://kapi.kakao.com/v1/user/unlink", {
                    'target_id_type': 'user_id',
                    'target_id': user.id.replace('KAKAO:', '')
                }, {
                    headers: {
                        'Authorization': 'KakaoAK ' + process.env.KAKAO_KEY
                    }
                })
            } catch (error) {
                console.error(error.message)
            }
        }


        return updatedUser
    }
}))

export const updateFcmToken = mutationField(t => t.field('updateFcmToken', {
    type: 'User',
    args: {
        token: nonNull(stringArg())
    },
    resolve: async (_, { token }, ctx) => {
        const { id } = await getIUser(ctx)

        const user = await ctx.prisma.user.update({
            where: { id },
            data: { fcmToken: token }
        })

        return user
    }
}))