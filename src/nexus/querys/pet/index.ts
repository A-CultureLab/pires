import { queryField } from "nexus";
import getIUser from "../../../utils/getIUser";


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



export * from './petGroupByAddress'