import axios from "axios";
import haversineDistance from "haversine-distance";
import { objectType } from "nexus";
import getIUser from "../../utils/getIUser";

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.phone()
        t.model.profileId()
        t.model.name()
        t.nonNull.string('image', {
            resolve: ({ image }) => image || 'https://sworna.com/wp-content/uploads/2020/07/pp.png'
        })
        t.model.gender()
        t.model.birth()
        t.model.inflow()
        t.model.instagramId()
        t.model.introduce()
        t.model.agreementDate()
        t.model.marketingPushDate()
        t.model.withdrawDate()
        t.model.withdrawReason()
        t.model.addressId()
        t.model.address()
        t.model.pets()
        t.model.chats()
        t.model.userChatRoomInfos()
        t.model.reports()
        t.model.myReports()
        t.model.posts()
        t.model.notificatedPosts()
        t.model.likedPosts()
        t.model.postComments()
        t.model.postReplyComment()
        t.model.medias()
        t.model.likedMedias()
        t.model.followers()
        t.model.followings()
        t.model.mediaComments()
        t.model.mediaReplyComments()
        t.model.mediaReplyTargetedComments()
        t.nonNull.int('notReadChatCount', {
            resolve: async ({ id }, { }, ctx) => {
                return ctx.prisma.chat.count({ where: { notReadUserChatRoomInfos: { some: { userId: id } } } })
            }
        })
        t.nonNull.int('followerCount', {
            resolve: async ({ id }, { }, ctx) => {
                return ctx.prisma.user.count({ where: { followings: { some: { id } } } })
            }
        })
        t.nonNull.int('followingCount', {
            resolve: async ({ id }, { }, ctx) => {
                return ctx.prisma.user.count({ where: { followings: { some: { id } } } })
            }
        })
        t.nonNull.int('mediaCount', {
            resolve: async ({ id, instagramId }, { }, ctx) => {
                const localMediaCount = await ctx.prisma.media.count({ where: { userId: id, isInstagram: false } })
                try {
                    if (!instagramId) return localMediaCount

                    const { data: instagramUserData } = await axios.get(`https://www.instagram.com/${instagramId}/?__a=1`, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'User-Agent': 'Mozilla',
                            'Cookie': `sessionid=${process.env.INSTA_SESSION_ID}; Path=/; Domain=.instagram.com;`
                        },
                        withCredentials: true
                    })

                    return localMediaCount + instagramUserData.graphql.user.edge_owner_to_timeline_media.count
                } catch (error) {
                    return localMediaCount
                }
            }
        })
        t.nonNull.boolean('isIFollowed', {
            resolve: async ({ id }, { }, ctx) => {
                const user = await getIUser(ctx, true)
                if (!user) return false
                const currentUser = await ctx.prisma.user.findFirst({
                    where: {
                        id: user.id,
                        followings: { some: { id } }
                    }
                })
                return !!currentUser
            }
        })
        t.nonNull.int('age', {
            resolve: ({ birth }, { }, ctx) => {
                const today = new Date()
                const birthDate = new Date(birth)

                const age = today.getFullYear() - birthDate.getFullYear() + 1
                return age
            }
        })
    }
})