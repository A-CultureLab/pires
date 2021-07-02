import { queryField, queryType } from "nexus";

export const userR = queryType({
    definition: (t) => {
        t.crud.user()
        t.crud.users({
            filtering: true,
            ordering: true,
            pagination: true
        })
    }
})

export const totalUserNum = queryField(t => t.field('totalUserNum', {
    type: 'Int',
    resolve: async (_, { }, ctx) => {
        return ctx.prisma.user.count()
    }
}))