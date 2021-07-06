import { queryType } from "nexus"

export const chatRoomR = queryType({
    definition: (t) => {
        t.crud.chatRoom()
        t.crud.chatRooms({
            filtering: true,
            ordering: true,
            pagination: true
        })
    }
})