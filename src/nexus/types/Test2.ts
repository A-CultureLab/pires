import { objectType } from "nexus";

export const Test2 = objectType({
    name: 'Test2',
    definition(t) {
        t.model.id()
        t.model.user()
        t.model.userId()
    }
})