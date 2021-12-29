import { objectType } from "nexus";

export const MediaLike = objectType({
    name: 'MediaLike',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.user()
        t.model.media()
        t.model.userId()
        t.model.mediaId()
    }
})