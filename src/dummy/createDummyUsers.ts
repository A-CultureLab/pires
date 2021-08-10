import { prisma } from "../context"
import faker from 'faker/locale/ko'
import dayjs from "dayjs"
import { Gender, PetType } from "@prisma/client"

const NUMBER = 450

const createDummyUsers = async () => {


    for (let i = 0; i < NUMBER; i++) {
        try {
            const address = await prisma.address.findUnique({ where: { id: i + 8400 } }) // 기존 주소에서 카피

            if (!address) continue

            const user = await prisma.user.create({
                data: {
                    id: faker.datatype.uuid(),
                    agreementDate: new Date(),
                    birth: faker.date.between(dayjs().set('year', 1970).toDate(), dayjs().set('year', 2010).toDate()),
                    email: faker.datatype.uuid(),
                    gender: faker.random.arrayElement([Gender.female, Gender.male]),
                    image: faker.image.avatar(),
                    introduce: faker.lorem.lines(4),
                    name: faker.name.lastName() + faker.name.firstName(),
                    uniqueKey: faker.datatype.uuid(),
                    address: {
                        create: {
                            area1: { connect: { id: address.area1Id } },
                            area2: { connect: { id: address.area2Id } },
                            area3: { connect: { id: address.area3Id } },
                            land: { connect: { id: address.landId } },
                        }
                    },
                    pets: {
                        createMany: {
                            data: Array(faker.datatype.number({ min: 1, max: 10 })).fill(0).map((_, i) => ({
                                birth: faker.date.between(dayjs().set('year', 2010).toDate(), dayjs().set('year', 2020).toDate()),
                                character: faker.lorem.words(4),
                                gender: faker.random.arrayElement([Gender.female, Gender.male]),
                                image: faker.image.animals(512, 512),
                                vaccinated: faker.datatype.boolean(),
                                neutered: faker.datatype.boolean(),
                                name: faker.name.lastName(),
                                orderKey: i,
                                type: faker.random.arrayElement([PetType.cat, PetType.dog]),
                                species: faker.random.word(),
                                weight: faker.datatype.number({ min: 1, max: 20 }),
                            }))
                        }
                    }
                },
            })
            console.log(user)
        } catch (error) {
            console.log(error)
        }

    }
}

// createDummyUsers()