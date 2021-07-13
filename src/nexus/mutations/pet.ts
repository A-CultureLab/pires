import { mutationField, nonNull, inputObjectType, stringArg, list, intArg } from "nexus";
import getIUser from "../../utils/getIUser";

export const RegistPetInput = inputObjectType({
    name: 'RegistPetInput',
    definition(t) {
        t.nonNull.string('name')
        t.nonNull.string('image')
        t.nonNull.field('type', { type: 'PetType' })
        t.nonNull.string('species')
        t.nonNull.string('character')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })
        t.nonNull.float('weight')
        t.nonNull.boolean('neutered')
        t.nonNull.boolean('vaccinated')
    }
})

export const registPet = mutationField(t => t.field('registPet', {
    type: 'Pet',
    args: {
        data: nonNull(RegistPetInput)
    },
    resolve: async (_, { data }, ctx) => {
        const user = await getIUser(ctx)

        const { _max } = await ctx.prisma.pet.aggregate({
            where: { userId: user.id },
            _max: { orderKey: true }
        })

        return ctx.prisma.pet.create({
            data: {
                ...data,
                orderKey: _max.orderKey !== null ? _max.orderKey + 1 : 0,
                user: {
                    connect: { id: user.id }
                }
            }
        })

    }
}))

export const sortPets = mutationField(t => t.nonNull.list.nonNull.field('sortPets', {
    type: 'Pet',
    args: {
        data: nonNull(list(nonNull(intArg())))
    },
    resolve: async (_, { data }, ctx) => {
        const pets = await Promise.all(data.map((v, i) => ctx.prisma.pet.update({
            where: { id: v },
            data: { orderKey: i }
        })))

        return pets
    }
}))