import { queryType } from "nexus"

export const locationR = queryType({
    definition: (t) => {
        t.crud.location()
        t.crud.locations({
            filtering: true,
            ordering: true,
            pagination: true,
        })
    }
})