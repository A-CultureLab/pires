import { arg, intArg, mutationField, mutationType, stringArg } from "nexus";

export const userCUD = mutationType({
    definition: (t) => {
        t.crud.updateOneUser()
    }
})