import { mutationField, nonNull, inputObjectType } from "nexus";
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
        return ctx.prisma.pet.create({
            data: {
                ...data,
                user: {
                    connect: { id: user.id }
                }
            }
        })

    }
}))