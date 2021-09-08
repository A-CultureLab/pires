import { objectType } from "nexus";

export const Report = objectType({
    name: 'Report',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()

        t.model.reason()
        t.model.reporter()

        t.model.user()
        t.model.chat()
        t.model.chatRoom()

        t.model.reporterId()
        t.model.userId()
        t.model.chatId()
        t.model.chatRoomId()
    }
})