import { objectType } from "nexus";

export const Pet = objectType({
    name: 'Pet',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
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
        t.model.userId()
    }
})