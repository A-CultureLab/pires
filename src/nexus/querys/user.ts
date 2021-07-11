import axios from "axios"
import { floatArg, nonNull, objectType, queryField, stringArg } from "nexus"
import { userAuth } from "../../lib/firebase"
import getIUser from "../../utils/getIUser"
import { config } from 'dotenv'

config()

// Query - 내 정보를 가져옴
export const iUser = queryField(t => t.field('iUser', {
    type: 'User',
    resolve: async (_, { }, ctx) => {
        const user = await getIUser(ctx)
        return user
    }
}))


// kakao access token을 firebase token 으로 변경
export const kakaoTokenToFirebaseToken = queryField(t => t.nonNull.field('kakaoTokenToFirebaseToken', {
    type: 'String', // firebase token
    args: {
        kakaoAccessToken: nonNull(stringArg())
    },
    resolve: async (_, { kakaoAccessToken }, ctx) => {
        // 카카오 rest api 로 유저 세부 정보 가져오기
        const result = await axios.post(
            'https://kapi.kakao.com/v2/user/me',
            { property_keys: ['kakao_account.email', 'properties.nickname', 'properties.profile_image'] },
            { headers: { 'Authorization': `Bearer ${kakaoAccessToken}` } }
        )
        if (!result.data.id) throw new Error('유효하지 않은 아이디')
        const kakaoUserId = `KAKAO:${result.data.id}`
        const properties = {
            email: result?.data?.kakao_account?.email,
            displayName: result?.data?.properties?.nickname || undefined,
            photoURL: result?.data?.properties?.profile_image || undefined,
        }
        // 파이어베이스에 유저 생성 or 업데이트
        try {
            await userAuth.updateUser(kakaoUserId, properties)
        } catch (error) {
            if (error.code !== 'auth/user-not-found') throw error
            userAuth.createUser({ ...properties, uid: kakaoUserId })
        }

        // 파이어베이스 토큰 생성
        const firebaseToken = await userAuth.createCustomToken(kakaoUserId, { provider: 'KAKAO' })

        return firebaseToken
    }
}))

export const region = objectType({
    name: 'Region',
    definition(t) {
        t.nonNull.string('id')
        t.nonNull.string('address')
        t.nonNull.string('postcode')
        t.nonNull.float('latitude')
        t.nonNull.float('longitude')
    }
})

// 좌표를 주소로 전환
export const coordsToRegion = queryField(t => t.nullable.field('coordsToRegion', {
    type: region,
    args: {
        latitude: nonNull(floatArg()),
        longitude: nonNull(floatArg())
    },
    resolve: async (_, { longitude, latitude }) => {
        const { data } = await axios.get('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc', {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': process.env['X-NCP-APIGW-API-KEY-ID'],
                'X-NCP-APIGW-API-KEY': process.env['X-NCP-APIGW-API-KEY']
            },
            params: {
                coords: longitude.toString() + ',' + latitude.toString(),
                orders: 'roadaddr',
                output: 'json'
            }
        })

        if (data.status.code !== 0) return null
        const land = data.results[0].land
        let address = ''

        address += land.name
        if (land.number1) address += ' ' + land.number1
        if (land.number2) address += ' ' + land.number2
        if (land.addition0?.value) address += ' ' + land.addition0.value

        return {
            id: data.results[0].code.id,
            latitude,
            longitude,
            postcode: land.addition1.value,
            address
        }
    }
}))