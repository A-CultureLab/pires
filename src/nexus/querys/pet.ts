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

export const PetGroupByPostCode = objectType({
    name: 'PetGroupByPostCode',
    definition(t) {
        t.nonNull.list.nonNull.field('pets', { type: 'Pet' })
        t.nonNull.int('count')
        t.nonNull.float('latitude')
        t.nonNull.float('longitude')
        t.nonNull.string('postcode')
    }
})

export const mapPets = queryField(t => t.nonNull.list.field('mapPets', {
    type: PetGroupByPostCode,
    args: {
        cameraRegion: nonNull(CameraRegionInput)
    },
    resolve: async (_, { cameraRegion }, ctx) => {

        const w = 0

        return []
    }
}))