import { objectType } from "nexus";

export const Address = objectType({
    name: 'Address',
    definition(t) {
        t.model.postcode()
        t.model.updatedAt()
        t.model.addressName()
        t.model.buildingName()
        t.model.latitude()
        t.model.longitude()
        t.model.data()
        t.model.users()
    }
})