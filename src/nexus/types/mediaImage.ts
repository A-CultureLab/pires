import { objectType } from "nexus";

export const MediaImage = objectType({
    name: 'MediaImage',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.orderKey()
        t.model.url()
        t.model.media()
        t.model.mediaId()
    }
})