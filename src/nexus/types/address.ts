import haversineDistance from "haversine-distance";
import { inputObjectType, objectType } from "nexus";
import getIUser from "../../utils/getIUser";

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
        t.nonNull.string('addressFull', {
            resolve: async ({ id }, _, ctx) => {
                const data = await ctx.prisma.address.findUnique({
                    where: { id },
                    include: {
                        area1: true,
                        area2: true,
                        area3: true,
                        land: true
                    }
                })
                if (!data) throw new Error
                return `${data.area1.name} ${data.area2.name} ${data.area3.name}`
                // ${data.land.buildingName || data.land.buildingName}
            }
        })
        t.nonNull.string('addressShort', {
            resolve: async ({ area2Id }, _, ctx) => {
                const area2 = await ctx.prisma.area2.findUnique({ where: { id: area2Id } })
                if (!area2) throw new Error
                return area2.name
            }
        })
        t.nullable.float('distance', {
            resolve: async ({ id }, { }, ctx) => {
                const iUser = await getIUser(ctx, true)
                if (!iUser) return null

                const targetAddress = await ctx.prisma.address.findUnique({
                    where: { id },
                    include: { land: true }
                })
                const address = await ctx.prisma.address.findUnique({
                    where: { id: iUser.addressId },
                    include: { land: true }
                })
                if (!targetAddress) return null
                if (!address) return null

                const meter = haversineDistance({
                    latitude: targetAddress.land.latitude,
                    longitude: targetAddress.land.longitude
                }, {
                    latitude: address.land.latitude,
                    longitude: address.land.longitude
                })

                return meter
            }
        })
    }
})

export const Area1 = objectType({
    name: 'Area1',
    definition(t) {
        t.model.id()

        t.model.name()
        t.model.latitude()
        t.model.longitude()

        t.model.addresses()
    }
})

export const Area2 = objectType({
    name: 'Area2',
    definition(t) {
        t.model.id()

        t.model.name()
        t.model.latitude()
        t.model.longitude()

        t.model.addresses()
    }
})

export const Area3 = objectType({
    name: 'Area3',
    definition(t) {
        t.model.id()

        t.model.name()
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

        t.nonNull.string('name', {
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

export type AddressKeys = 'area1Id' | 'area2Id' | 'area3Id' | 'landId'