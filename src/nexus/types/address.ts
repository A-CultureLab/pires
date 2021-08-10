import { inputObjectType, objectType } from "nexus";

export const Address = objectType({
    name: 'Address',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()

        // Areas
        t.model.area1Id()
        t.model.area2Id()
        t.model.area3Id()
        t.model.landId()

        t.model.area1()
        t.model.area2()
        t.model.area3()
        t.model.land()
        //

        t.model.user()
    }
})

export const Area1 = objectType({
    name: 'Area1',
    definition(t) {
        t.model.id()

        t.model.latitude()
        t.model.longitude()

        t.model.addresses()
    }
})

export const Area2 = objectType({
    name: 'Area2',
    definition(t) {
        t.model.id()

        t.model.latitude()
        t.model.longitude()

        t.model.addresses()
    }
})

export const Area3 = objectType({
    name: 'Area3',
    definition(t) {
        t.model.id()

        t.model.latitude()
        t.model.longitude()

        t.model.addresses()
    }
})



export const Land = objectType({
    name: 'Land',
    definition(t) {
        t.model.id()

        t.model.addressName()
        t.model.buildingName()

        t.model.latitude()
        t.model.longitude()

        t.model.addresses()

        t.nonNull.string('fullName', {
            resolve: ({ addressName, buildingName }) => {
                return buildingName || addressName
            }
        })
    }
})

export const CameraRegionInput = inputObjectType({
    name: 'CameraRegionInput',
    definition(t) {
        t.nonNull.float('latitude')
        t.nonNull.float('longitude')
        t.nonNull.float('latitudeDelta')
        t.nonNull.float('longitudeDelta')
    }
})

export const Region = objectType({
    name: 'Region',
    definition(t) {
        t.nonNull.float('latitude')
        t.nonNull.float('longitude')
    }
})