import dayjs from "dayjs";
import { objectType } from "nexus";

export const Pet = objectType({
    name: 'Pet',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.orderKey()
        t.model.name()
        t.model.image()
        t.model.type()
        t.model.species()
        t.model.character()
        t.model.gender()
        t.model.birth()
        t.model.weight()
        t.model.neutered()
        t.model.vaccinated()
        t.model.user()
        t.model.tagedMedias()
        t.model.userId()
        t.nonNull.string('age', {
            resolve({ birth }) {
                const today = dayjs()
                const birthDay = dayjs(birth)
                const year = today.diff(birthDay, 'year')
                const month = today.diff(birth, 'month')

                if (month < 12) return (month + 1).toString() + '개월'
                return year.toString() + '세'
            }
        })
    }
})