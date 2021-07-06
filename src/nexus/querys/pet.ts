import { queryType } from "nexus"

export const petR = queryType({
    definition: (t) => {
        t.crud.pet()
        t.crud.pets({
            filtering: true,
            ordering: true,
            pagination: true
        })
    }
})