import axios from "axios"
import { floatArg, nonNull, objectType, queryField, stringArg } from "nexus"
import { config } from 'dotenv'

config()

// 좌표를 주소로 전환
export const coordsToRegion = queryField(t => t.nullable.field('coordsToRegion', {
    type: 'Address',
    args: {
        latitude: nonNull(floatArg()),
        longitude: nonNull(floatArg())
    },
    resolve: async (_, { longitude, latitude }, ctx) => {
        const { data } = await axios.get('https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc', {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': process.env['NCP_ID'],
                'X-NCP-APIGW-API-KEY': process.env['NCP_KEY']
            },
            params: {
                coords: longitude.toString() + ',' + latitude.toString(),
                orders: 'roadaddr',
                output: 'json'
            }
        })

        if (data.status.code !== 0) return null

        const land = data.results[0].land
        const postcode = land.addition1.value

        let newAddress = ''

        newAddress += land.name
        if (land.number1) newAddress += ' ' + land.number1
        if (land.number2) newAddress += ' ' + land.number2

        const newData = {
            addressName: newAddress,
            buildingName: land.addition0.value,
            latitude, // TODO postcode to latitude 찾아보자
            longitude,
            data
        }


        const address =
            await ctx.prisma.address.findUnique({ where: { postcode } }) // 이미 있다면
                ? await ctx.prisma.address.update({ where: { postcode }, data: newData }) // 업데이트
                : await ctx.prisma.address.create({ data: { ...newData, postcode } }) // 없다면 생성

        return address
    }
}))