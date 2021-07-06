import { objectType } from "nexus";

export const Location = objectType({
    name: 'Location',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.name()
        t.model.phone()
        t.model.category()
        t.model.x()
        t.model.y()
        t.model.postCode()
        t.model.roadAddress()
        t.model.jibunAddress()
        t.model.images()
    }
})