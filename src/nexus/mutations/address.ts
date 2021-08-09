import { floatArg, mutationField, nonNull } from "nexus"

import axios from "axios"
import { config } from 'dotenv'

config()

// 좌표를 주소로 전환
export const createAddress = mutationField(t => t.nullable.field('createAddress', {
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
        const area1 = data.results[0].region.area1
        const area2 = data.results[0].region.area2
        const area3 = data.results[0].region.area3

        // Address name generate
        let addressName = ''
        addressName += land.name
        if (land.number1) addressName += ' ' + land.number1
        if (land.number2) addressName += ' ' + land.number2

        const buildingName = land.addition0.value
        const landId = addressName + '@' + buildingName // ! Hash


        const address = ctx.prisma.address.create({
            data: {
                area1: {
                    connectOrCreate: {
                        where: { id: area1.name },
                        create: {
                            id: area1.name,
                            longitude: area1.coords.center.x,
                            latitude: area1.coords.center.y
                        }
                    }
                },
                area2: {
                    connectOrCreate: {
                        where: { id: area2.name },
                        create: {
                            id: area2.name,
                            longitude: area2.coords.center.x,
                            latitude: area2.coords.center.y
                        }
                    }
                },
                area3: {
                    connectOrCreate: {
                        where: { id: area3.name },
                        create: {
                            id: area3.name,
                            longitude: area3.coords.center.x,
                            latitude: area3.coords.center.y
                        }
                    }
                },
                land: {
                    connectOrCreate: {
                        where: { id: landId },
                        create: {
                            id: landId,
                            addressName,
                            buildingName,
                            latitude, // TODO 건물주소 to latitude 찾아보자
                            longitude,
                        }
                    }
                }
            }
        })

        return address
    }
}))