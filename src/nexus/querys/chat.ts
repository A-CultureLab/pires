import { queryType } from "nexus"

export const chatR = queryType({
    definition: (t) => {
        t.crud.chat()
        t.crud.chats({
            filtering: true,
            ordering: true,
            pagination: true
        })
    }
})