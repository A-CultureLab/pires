import { queryType } from "nexus"

export const locationImageR = queryType({
    definition: (t) => {
        t.crud.locationImage()
    }
})