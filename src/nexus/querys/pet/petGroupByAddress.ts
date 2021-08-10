import { enumType, nonNull, objectType, queryField } from "nexus"



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

        const w = 10 // 가중치 deleta기반으로

        const addressGroupBy = await ctx.prisma.address.groupBy({
            by: ['landId'],
            where: {
                land: {
                    AND: [
                        { latitude: { gte: cameraRegion.latitude - w } },
                        { latitude: { lte: cameraRegion.latitude + w } },
                        { longitude: { gte: cameraRegion.longitude - w } },
                        { longitude: { lte: cameraRegion.longitude + w } },
                    ],
                }
            }
        })


        const petGroupByAddress = await Promise.all(
            addressGroupBy.map(({ landId }) =>
                (async () => {
                    const pets = await ctx.prisma.pet.findMany({
                        where: { user: { address: { landId } } },
                        orderBy: { createdAt: 'desc' }, // 신규등록한
                        take: 2 // 두개만 
                    })
                    const count = await ctx.prisma.pet.count({
                        where: { user: { address: { landId } } },
                    })

                    const land = await ctx.prisma.land.findUnique({
                        where: { id: landId }
                    })

                    const groupName = (land?.buildingName || land?.addressName) || ''
                    const region = {
                        latitude: land?.latitude || 0,
                        longitude: land?.longitude || 0
                    }

                    return {
                        id: landId,
                        groupName,
                        count,
                        pets,
                        region
                    }
                })()
            )
        )


        return {
            groupBy: 'land',
            petGroup: petGroupByAddress.filter(v => v.pets.length > 0) // 주소는 존재하지만 동물은 없는 경우를 필터링
        }
    }
}))