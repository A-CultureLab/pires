import { objectType } from "nexus";

export const Chat = objectType({
    name: 'Chat',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.message()
        t.model.image()
        t.model.user()
        t.model.chatRoom()
        t.model.userId()
        t.model.chatRoomId()
    }
})