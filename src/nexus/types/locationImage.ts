import { objectType } from "nexus";

export const LocationImage = objectType({
    name: 'LocationImage',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.url()
        t.model.location()
        t.model.locationId()
    }
})