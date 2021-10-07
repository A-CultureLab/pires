import { prisma } from "../context"

const updateNewAddressFormat = async () => {
    const area1s = await prisma.area1.findMany()
    for (const area1 of area1s) {
        await prisma.area1.update({
            where: { id: area1.id },
            data: {
                id: area1.id,
                name: area1.id
            }
        })
    }

    const area2s = await prisma.area2.findMany({
        include: {
            addresses: true
        }
    })
    for (const area2 of area2s) {
        await prisma.area2.update({
            where: { id: area2.id },
            data: {
                id: area2.addresses[0].area1Id + '@' + area2.id,
                name: area2.id
            }
        })
    }
    const area3s = await prisma.area3.findMany({
        include: {
            addresses: true
        }
    })
    for (const area3 of area3s) {
        await prisma.area3.update({
            where: { id: area3.id },
            data: {
                id: area3.addresses[0].area2Id + '@' + area3.id,
                name: area3.id
            }
        })
    }

    const lands = await prisma.land.findMany({
        include: {
            addresses: true
        }
    })
    for (const land of lands) {
        await prisma.land.update({
            where: { id: land.id },
            data: {
                id: land.addresses[0].area3Id + '@' + land.id,
            }
        })
    }
}

// updateNewAddressFormat()