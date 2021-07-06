import { objectType } from "nexus";

export const ChatRoom = objectType({
    name: 'ChatRoom',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.users()
        t.model.chats()
    }
})