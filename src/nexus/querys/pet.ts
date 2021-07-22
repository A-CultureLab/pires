import { floatArg, inputObjectType, nonNull, objectType, queryField } from "nexus";
import getIUser from "../../utils/getIUser";

export const myPets = queryField(t => t.nonNull.list.nonNull.field('myPets', {
    type: 'Pet',
    resolve: async (_, { }, ctx) => {
        const user = await getIUser(ctx)

        return ctx.prisma.pet.findMany({
            where: { userId: user.id },
            orderBy: { orderKey: 'asc' }
        })
    }
}))

export const CameraRegionInput = inputObjectType({
    name: 'CameraRegionInput',
    definition(t) {
        t.nonNull.float('latitude')
        t.nonNull.float('latitudeDelta')
        t.nonNull.float('longitude')
        t.nonNull.float('longitudeDelta')
    }
})

export const PetGroupByAddress = objectType({
    name: 'PetGroupByAddress',
    definition(t) {
        t.nonNull.list.nonNull.field('pets', { type: 'Pet' })
        t.nonNull.int('count')
        t.nonNull.field('address', { type: 'Address' })
    }
})

export const mapPets = queryField(t => t.nonNull.list.nonNull.field('mapPets', {
    type: PetGroupByAddress,
    args: {
        cameraRegion: nonNull(CameraRegionInput)
    },
    resolve: async (_, { cameraRegion }, ctx) => {

        const w = 10 // 가중치 deleta기반으로
        const userGroupByAddress = await ctx.prisma.user.groupBy({
            by: ['addressPostcode'],
            where: {
                address: {
                    AND: [
                        { latitude: { gte: cameraRegion.latitude - w } },
                        { latitude: { lte: cameraRegion.latitude + w } },
                        { longitude: { gte: cameraRegion.longitude - w } },
                        { longitude: { lte: cameraRegion.longitude + w } },
                    ],
                }
            },
        })

        const petGroupByAddress = await Promise.all(
            userGroupByAddress.map(({ addressPostcode }) =>
                (async () => {
                    const pets = await ctx.prisma.pet.findMany({
                        where: { user: { addressPostcode } },
                        orderBy: { createdAt: 'desc' }, // 신규등록한
                        take: 2 // 두개만 
                    })
                    const count = await ctx.prisma.pet.count({
                        where: { user: { addressPostcode } }
                    })
                    const address: any = await ctx.prisma.address.findUnique({ // address는 존재할 수 밖에 없음
                        where: { postcode: addressPostcode }
                    })

                    return {
                        address,
                        count,
                        pets
                    }
                })()
            )
        )

        return petGroupByAddress.filter(v => v.pets.length > 0)
    }
}))