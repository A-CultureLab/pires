import { objectType } from "nexus";
import apolloError from "../../utils/apolloError";

export const Media = objectType({
    name: 'Media',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.images()
        t.model.content()
        t.model.isInstagram()
        t.model.user()
        t.model.tagedPets()
        t.model.likedUsers()
        t.model.mediaComment()
        t.model.userId()
        t.nonNull.string('thumnail', {
            resolve: async ({ id }, { }, ctx) => {
                const image = await ctx.prisma.mediaImage.findFirst({
                    where: { mediaId: id },
                    orderBy: { orderKey: 'asc' }
                })
                if (!image) throw apolloError('미디어 이미지가 없습니다.', 'DB_ERROR', { notification: false })
                return image.url
            }
        })
    }
})