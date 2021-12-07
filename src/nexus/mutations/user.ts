import { booleanArg, inputObjectType, mutationField, nonNull, nullable, stringArg } from "nexus";

import axios from "axios";
import getIUser from "../../utils/getIUser";
import { nanoid } from 'nanoid'
import apolloError from "../../utils/apolloError";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { prisma } from "../../context";

const createRefreshToken = async (userId: string) => {

    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1y' })
    // 토큰 업데이트 DB에 저장
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    })

    return refreshToken
}

// 회원가입 프로세스
// 전화번호 인증 요청
export const requestPhoneVerify = mutationField(t => t.nonNull.field('requestPhoneVerify', {
    type: 'String', // phoneVerifyCodeToken
    args: {
        phone: nonNull(stringArg()),
        phoneUnique: nullable(booleanArg({ default: true })) // 전화번호 중복 확인 true면 확인 false면 중복있어야함
    },
    resolve: async (_, { phone, phoneUnique }, ctx) => {
        // phone 중복 확인
        const user = await ctx.prisma.user.findUnique({ where: { phone } })
        if (phoneUnique && user) throw apolloError('이미 가입된 유저입니다', 'NO_PERMISSION')
        if (!phoneUnique && !user) throw apolloError('가입하지 않은 유저입니다', 'NO_PERMISSION')

        // 난수 생성
        const code = Array(4).fill(0).map(v => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 10)]).join('')
        console.log(code)
        // JWT 생성 유효기간 5분
        const phoneVerifyCodeToken = jwt.sign({ phone, code }, process.env.JWT_SECRET, { expiresIn: '5m' })

        // 코드 전송

        return phoneVerifyCodeToken
    }
}))
// 전화번호 인증번호 확인
export const confirmPhoneVerify = mutationField(t => t.nonNull.field('confirmPhoneVerify', {
    type: 'String', // phoneVerifySuccessToken
    args: {
        phoneVerifyCodeToken: nonNull(stringArg()),
        code: nonNull(stringArg())
    },
    resolve: async (_, { phoneVerifyCodeToken, code: _code }, ctx) => {
        // 토큰 파싱
        const { code, phone } = jwt.verify(phoneVerifyCodeToken, process.env.JWT_SECRET) as { phone: string, code: string }

        if (code !== _code) throw apolloError('인증번호가 다릅니다', 'NOT_MATCH')

        // JWT 생성 유효기간 30분
        const phoneVerifySuccessToken = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: '30m' })

        return phoneVerifySuccessToken
    }
}))

export const changePassword = mutationField(t => t.nonNull.field('changePassword', {
    type: 'Boolean',
    args: {
        phoneVerifySuccessToken: nonNull(stringArg()),
        password: nonNull(stringArg()) // 변경할 비밀번호
    },
    resolve: async (_, { password, phoneVerifySuccessToken }, ctx) => {
        // 토큰 파싱
        const { phone } = jwt.verify(phoneVerifySuccessToken, process.env.JWT_SECRET) as { phone: string }

        // password hash
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password, salt)

        // 비밀번호 변경
        await ctx.prisma.user.update({
            where: { phone },
            data: { password: passwordHash }
        })

        return true
    }
}))


// 회원가입
export const SignupInput = inputObjectType({
    name: 'SignupInput',
    definition(t) {
        t.nonNull.string('password')

        t.nullable.string('image')
        t.nonNull.string('profileId')
        t.nonNull.string('name')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })
        t.nonNull.string('addressId')

        t.nullable.string('instagramId')
        t.nonNull.string('introduce')

        t.nonNull.string('inflow')

        t.nonNull.field('agreementDate', { type: 'DateTime' })
        t.nullable.field('marketingPushDate', { type: 'DateTime' })
    }
})

export const signup = mutationField(t => t.nonNull.field('signup', {
    type: 'String',
    args: {
        phoneVerifySuccessToken: nonNull(stringArg()),
        data: nonNull(SignupInput)
    },
    resolve: async (_, { data, phoneVerifySuccessToken }, ctx) => {
        // 토큰 파싱
        const { phone } = jwt.verify(phoneVerifySuccessToken, process.env.JWT_SECRET) as { phone: string }

        const { instagramId, password, ..._data } = data

        // password hash
        if (!/^[a-zA-Z0-9]{8,20}$/.test(password)) throw apolloError('비밀번호는 숫자와 영문자 조합으로 8~20자리를 사용해야 합니다', 'INVALID_ARGS')
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password, salt)

        // 유저 생성
        const user = await ctx.prisma.user.create({
            data: {
                ..._data,
                phone,
                password: passwordHash,
                instagramId: data.instagramId || null, // '' <- 이것도 인스타그램 크롤링해버려서 아예 null로
                addressId: undefined,
                address: { connect: { id: data.addressId } }
            }
        })

        // 토큰 생성
        const refreshToken = await createRefreshToken(user.id)

        return refreshToken
    }
}))

export const login = mutationField(t => t.nonNull.field('login', {
    type: 'String',
    args: {
        phone: nonNull(stringArg()),
        password: nonNull(stringArg())
    },
    resolve: async (_, { phone, password }, ctx) => {

        const user = await ctx.prisma.user.findUnique({
            where: { phone }
        })
        // phone 확인
        if (!user) throw apolloError('가입되지 않은 전화번호 입니다', 'NO_PERMISSION')
        // password 확인
        if (!bcrypt.compareSync(password, user.password)) throw apolloError('비밀번호가 틀립니다', 'NO_PERMISSION')

        // 리프레시 토큰 생성
        const refreshToken = await createRefreshToken(user.id)
        return refreshToken
    }
}))
// 액세스토큰 발급 이게 에러나면 로컬에서 리프레시 토큰 지워야함
export const getAccessToken = mutationField(t => t.nonNull.field('getAccessToken', {
    type: 'String',
    args: {
        refreshToken: nonNull(stringArg())
    },
    resolve: async (_, { refreshToken }, ctx) => {

        const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET) as { userId: string }

        const user = await ctx.prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw apolloError('없는 유저입니다', 'INVALID_ARGS')
        if (user.refreshToken !== refreshToken) throw apolloError('잘못된 리프레시 토큰입니다', 'INVALID_ARGS') // 리프레시토큰 유효 확인

        // AccessToken 생성
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10m' })

        return accessToken
    }
}))
export const UpdateUserInput = inputObjectType({
    name: 'UpdateUserInput',
    definition(t) {
        t.nonNull.string('image')
        t.nonNull.string('profileId')
        t.nonNull.string('name')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })
        t.nonNull.string('addressId')
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

        return ctx.prisma.user.update({
            where: { id: ctx.iUser.id },
            data: {
                ...data,
                instagramId: data.instagramId || null,
                addressId: undefined,
                address: ctx.iUser.addressId !== data.addressId ? { connect: { id: data.addressId } } : undefined // 이미 연결이 되있다면 유지
            }
        })
    }
}))

export const logout = mutationField(t => t.nonNull.field('logout', {
    type: 'Boolean',
    resolve: async (_, { }, ctx) => {
        // refreshToken 만료
        await ctx.prisma.user.update({
            where: { id: ctx.iUserId },
            data: { refreshToken: null }
        })
        return true
    }
}))

export const withdraw = mutationField(t => t.nonNull.field('withdraw', {
    type: 'User',
    args: {
        reason: nonNull(stringArg())
    },
    resolve: async (_, { reason }, ctx) => {
        // 반려동물 삭제
        await ctx.prisma.pet.deleteMany({
            where: { userId: ctx.iUserId }
        })
        // // 내가쓴 답글 삭제
        // await ctx.prisma.postReplyComment.deleteMany({
        //     where: { userId: user.id }
        // })
        // // 내가쓴 댓글에 답글 삭제
        // await ctx.prisma.postReplyComment.deleteMany({
        //     where: { postComment: { userId: user.id } }
        // })
        // // 내가쓴 댓글 삭제
        // await ctx.prisma.postComment.deleteMany({
        //     where: { userId: user.id }
        // })
        // // 내가쓴 게시글에 댓글 삭제
        // await ctx.prisma.postComment.deleteMany({
        //     where: { post: { userId: user.id } },
        // })
        // // 내가쓴 게시글 삭제
        // await ctx.prisma.post.deleteMany({
        //     where: { userId: user.id }
        // })
        // 유저 정보 더미데이터로 덮어씌우기
        const updatedUser = await ctx.prisma.user.update({
            where: { id: ctx.iUserId },
            data: {
                name: '탈퇴한 사용자',
                phone: nanoid(20),
                refreshToken: null,
                profileId: nanoid(10),
                password: nanoid(10),
                image: 'https://static.thenounproject.com/png/574748-200.png',
                withdrawDate: new Date(),
                instagramId: null,
                withdrawReason: reason,
                fcmToken: null,
            }
        })

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