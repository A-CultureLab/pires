import { enumType, nonNull, objectType, queryField } from "nexus"
import groupByAddressIdGenerator from "../../../utils/groupByAddressIdGenerator"
import { AddressKeys } from "../../types"




export const PetGroupByAddressGroupBy = enumType({
    name: 'PetGroupByAddressGroupBy',
    members: ['area1', 'area2', 'area3', 'land']
})

export const PetGroup = objectType({
    name: 'PetGroup',
    definition(t) {
        t.nonNull.string('id') // 중복 안되는 해시값 나중에 parsing용으로 사용됨
        t.nonNull.string('groupName') // UI에 타이틀로 사용됨 / 단위의 주소 예) 경기도, 용산구, 현대아파트 ...
        t.nonNull.list.nonNull.field('pets', { type: 'Pet' }) // 앞에서 2개
        t.nonNull.int('count')
        t.nonNull.field('region', { type: 'Region' })
    }
})

export const PetGroupByAddress = objectType({
    name: 'PetGroupByAddress',
    definition(t) {
        t.nonNull.field('groupBy', { type: PetGroupByAddressGroupBy }) // delta값에 따른 검색 단위 area1/area2/area3/land
        t.nonNull.list.nonNull.field('petGroup', { type: PetGroup })
    }
})

export const petGroupByAddress = queryField(t => t.nonNull.field('petGroupByAddress', {
    type: PetGroupByAddress,
    args: {
        cameraRegion: nonNull('CameraRegionInput')
    },
    resolve: async (_, { cameraRegion }, ctx) => {


        const groupBy = (() => {
            const delta = cameraRegion.latitudeDelta
            console.log(delta)
            if (delta > 0.5) return 'area1'
            if (delta > 0.15) return 'area2'
            if (delta > 0.03) return 'area3'
            return 'land'
        })()

        const groupById: AddressKeys = groupBy + 'Id' as AddressKeys


        const addressGroupBy = await ctx.prisma.address.groupBy({
            by: [groupById],
            where: {
                [groupBy]: {
                    AND: [
                        { latitude: { gte: cameraRegion.latitude - cameraRegion.latitudeDelta / 2 } },
                        { latitude: { lte: cameraRegion.latitude + cameraRegion.latitudeDelta / 2 } },
                        { longitude: { gte: cameraRegion.longitude - cameraRegion.longitudeDelta / 2 } },
                        { longitude: { lte: cameraRegion.longitude + cameraRegion.longitudeDelta / 2 } },
                    ],
                }
            }
        })

        console.log(addressGroupBy)

        const petGroupByAddress = await Promise.all(
            addressGroupBy.map((data) =>
                (async () => {
                    const addressId = data[groupById]
                    const groupByAddressId = groupByAddressIdGenerator.generate(groupById, addressId)

                    const pets = await ctx.prisma.pet.findMany({
                        where: { user: { address: { [groupById]: addressId } } },
                        orderBy: { createdAt: 'desc' }, // 신규등록한
                        take: 2 // 두개만 
                    })
                    const count = await ctx.prisma.pet.count({
                        where: { user: { address: { [groupById]: addressId } } },
                    })

                    //@ts-ignore
                    const area = await ctx.prisma[groupBy].findUnique({ where: { id: addressId } })

                    const groupName = (area?.buildingName || area?.addressName) || addressId
                    const region = {
                        latitude: area?.latitude || 0,
                        longitude: area?.longitude || 0
                    }

                    return {
                        id: groupByAddressId,
                        groupName,
                        count,
                        pets,
                        region
                    }
                })()
            )
        )

        return {
            groupBy,
            petGroup: petGroupByAddress.filter(v => v.pets.length > 0) // 주소는 존재하지만 동물은 없는 경우를 필터링
        }
    }
}))