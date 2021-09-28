import { inputObjectType, mutationField, nonNull, stringArg } from "nexus";

import axios from "axios";
import getIUser from "../../utils/getIUser";
import { userAuth } from "../../lib/firebase";
import { nanoid } from 'nanoid'
import apolloError from "../../utils/apolloError";

export const SignupInput = inputObjectType({
    name: 'SignupInput',
    definition(t) {
        t.nonNull.string('email')
        t.nonNull.string('image')

        t.nonNull.string('uniqueKey')
        t.nonNull.string('name')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })

        t.nonNull.string('addressId')
        t.nonNull.string('inflow')
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
        if (!token) throw apolloError('로그인이 필요한 작업입니다', 'LOGIN_REQUIRE')
        token = token.replace('Bearer ', '')
        const { uid: id } = await userAuth.verifyIdToken(token)
        return ctx.prisma.user.create({
            data: {
                ...data,
                snsLoginId: id,
                addressId: undefined,
                address: { connect: { id: data.addressId } }
            }
        })
    }
}))

export const UpdateUserInput = inputObjectType({
    name: 'UpdateUserInput',
    definition(t) {
        t.nonNull.string('image')
        t.nonNull.string('addressId')
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
                addressId: undefined,
                address: user.addressId !== data.addressId ? { connect: { id: data.addressId } } : undefined // 이미 연결이 되있다면 유지
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
                snsLoginId: 'deleted:' + nanoid(),
                email: 'deleted:' + nanoid(),
                uniqueKey: 'deleted:' + nanoid(),
                name: '탈퇴한 사용자',
                image: 'https://static.thenounproject.com/png/574748-200.png',
                withdrawDate: new Date(),
                withdrawReason: reason,
                fcmToken: null
            }
        })
        // 파이어베이스 유저 삭제
        await userAuth.deleteUser(user.snsLoginId)

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
            } catch (error: any) {
                // 안되더라도 상관 없음 
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