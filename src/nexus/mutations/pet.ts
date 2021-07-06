import { mutationType } from "nexus"

export const petCUD = mutationType({
    definition: (t) => {
        t.crud.updateOnePet()
    }
})