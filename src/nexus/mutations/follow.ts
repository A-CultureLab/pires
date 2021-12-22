import { mutationField, nonNull, stringArg } from "nexus"
import apolloError from "../../utils/apolloError"

export const following = mutationField(t => t.field('following', {
    type: 'Follow',
    args: {
        userId: nonNull(stringArg())
    },
    resolve: async (_, { userId }, ctx) => {
        return ctx.prisma.follow.create({
            data: {
                targetUser: { connect: { id: userId } },
                user: { connect: { id: ctx.iUserId } }
            }
        })
    }
}))

export const disFollowing = mutationField(t => t.field('disFollowing', {
    type: 'Boolean',
    args: {
        userId: nonNull(stringArg())
    },
    resolve: async (_, { userId }, ctx) => {

        const follow = await ctx.prisma.follow.findFirst({
            where: {
                targetUserId: userId,
                userId: ctx.iUserId
            }
        })
        if (!follow) throw apolloError('이미 팔로우 취소되었습니다', 'NO_PERMISSION')
        await ctx.prisma.follow.delete({
            where: { id: follow.id }
        })
        return true
    }
}))