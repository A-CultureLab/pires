import { mutationField, nonNull, inputObjectType, stringArg, list, intArg } from "nexus";
import getIUser from "../../utils/getIUser";

export const RegistPetInput = inputObjectType({
    name: 'RegistPetInput',
    definition(t) {
        t.nonNull.string('image')
        t.nonNull.string('name')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })
        t.nonNull.float('weight')
        t.nonNull.field('type', { type: 'PetType' })
        t.nonNull.string('species')
        t.nonNull.string('character')
    }
})

export const registPet = mutationField(t => t.field('registPet', {
    type: 'Pet',
    args: {
        data: nonNull(RegistPetInput)
    },
    resolve: async (_, { data }, ctx) => {
        const { _max } = await ctx.prisma.pet.aggregate({
            where: { userId: ctx.iUserId },
            _max: { orderKey: true }
        })

        return ctx.prisma.pet.create({
            data: {
                ...data,
                orderKey: _max.orderKey !== null ? _max.orderKey + 1 : 0,
                user: {
                    connect: { id: ctx.iUserId }
                }
            }
        })

    }
}))

export const updatePet = mutationField(t => t.field('updatePet', {
    type: 'Pet',
    args: {
        id: nonNull(stringArg()),
        data: nonNull(RegistPetInput)
    },
    resolve: async (_, { data, id }, ctx) => {
        return ctx.prisma.pet.update({
            where: { id },
            data
        })
    }
}))

export const deletePet = mutationField(t => t.field('deletePet', {
    type: 'Pet',
    args: {
        id: nonNull(stringArg())
    },
    resolve: async (_, { id }, ctx) => {
        return ctx.prisma.pet.delete({
            where: { id }
        })
    }
}))

export const sortPets = mutationField(t => t.nonNull.list.nonNull.field('sortPets', {
    type: 'Pet',
    args: {
        data: nonNull(list(nonNull(stringArg())))
    },
    resolve: async (_, { data }, ctx) => {
        const pets = await Promise.all(data.map((v, i) => ctx.prisma.pet.update({
            where: { id: v },
            data: { orderKey: i }
        })))

        return pets
    }
}))