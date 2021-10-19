import { objectType } from "nexus";

export const News = objectType({
    name: 'News',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.title()
        t.model.image()
        t.model.link()
        t.model.content()
    }
})