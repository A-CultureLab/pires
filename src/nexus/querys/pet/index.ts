import { intArg, nonNull, nullable, queryField, stringArg } from "nexus";
import getIUser from "../../../utils/getIUser";
import groupByAddressIdGenerator from "../../../utils/groupByAddressIdGenerator";


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