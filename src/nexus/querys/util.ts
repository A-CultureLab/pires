import axios from "axios"
import { floatArg, nonNull, objectType, queryField, stringArg } from "nexus"
import { config } from 'dotenv'

config()


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
                'X-NCP-APIGW-API-KEY-ID': process.env.NCP_ID,
                'X-NCP-APIGW-API-KEY': process.env.NCP_KEY
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