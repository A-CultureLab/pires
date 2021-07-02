import { intArg, mutationField, mutationType, stringArg } from "nexus";

export const userCUD = mutationType({
    definition: (t) => {
        // t.crud.createOneUser()
        // t.crud.updateOneUser()
        t.crud.deleteOneUser()
        t.crud.deleteManyUser()
        t.crud.updateManyUser()
    }
})

export const signupUser = mutationField(t => t.field('signupUser', {
    type: 'User',
    args: {
        name: stringArg(),
        age: intArg()
    },
    resolve: async (_, { name, age }, ctx) => {
        if (!name) throw new Error
        if (!age) throw new Error

        const user = ctx.prisma.user.create({
            data: {
                name,
                age
            }
        })

        return user
    }
}))