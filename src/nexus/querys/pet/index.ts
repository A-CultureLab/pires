import { inputObjectType, intArg, nonNull, nullable, queryField, stringArg } from "nexus";
import getIUser from "../../../utils/getIUser";
import groupByAddressIdGenerator from "../../../utils/groupByAddressIdGenerator";


export const myPets = queryField(t => t.nonNull.list.nonNull.field('myPets', {
    type: 'Pet',
    resolve: async (_, { }, ctx) => {

        return ctx.prisma.pet.findMany({
            where: { userId: ctx.iUserId },
            orderBy: { orderKey: 'asc' }
        })
    }
}))

const PetsAdressFilterInput = inputObjectType({
    name: 'PetsAdressFilterInput',
    definition(t) {
        t.nullable.string('area1Id')
        t.nullable.string('area2Id')
        t.nullable.string('area3Id')
        t.nullable.string('landId')
    }
})

export const pets = queryField(t => t.nonNull.list.nonNull.field('pets', {
    type: 'Pet',
    args: {
        filter: nullable(PetsAdressFilterInput),
        take: nullable(intArg({ default: 10 })),
        skip: nullable(intArg({ default: 0 }))
    },
    resolve: async (_, { filter, skip, take }, ctx) => {
        return ctx.prisma.pet.findMany({
            where: filter ? {
                user: {
                    address: {
                        area1Id: filter.area1Id || undefined,
                        area2Id: filter.area2Id || undefined,
                        area3Id: filter.area3Id || undefined,
                        landId: filter.landId || undefined
                    }
                }
            } : undefined,
            orderBy: { updatedAt: 'desc' },
            take: take || 0,
            skip: skip || 0
        })
    }
}))


export const petsByAddress = queryField(t => t.nonNull.list.nonNull.field('petsByAddress', {
    type: 'Pet',
    args: {
        addressGroupId: nonNull(stringArg()),
        take: nullable(intArg({ default: 10 })),
        skip: nullable(intArg({ default: 0 }))
    },
    resolve: async (_, { addressGroupId, take, skip }, ctx) => {
        const { addressKey, addressId } = groupByAddressIdGenerator.parse(addressGroupId)

        const pets = await ctx.prisma.pet.findMany({
            where: {
                user: {
                    address: {
                        [addressKey]: addressId,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: take || 0,
            skip: skip || 0
        })

        return pets
    }
}))


export * from './petGroupByAddress'