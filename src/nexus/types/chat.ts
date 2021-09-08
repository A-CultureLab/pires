import { objectType } from "nexus";

export const Chat = objectType({
    name: 'Chat',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.updatedAt()
        t.model.isDeleted()
        t.model.user()
        t.model.chatRoom()
        t.model.notReadUserChatRoomInfos()
        t.model.reports()
        t.model.userId()
        t.model.chatRoomId()
        t.nullable.string('message', {
            resolve: ({ message, isDeleted }) => {
                return isDeleted ? '삭제된 메시지' : message
            }
        })
        t.nullable.string('image', {
            resolve: ({ image, isDeleted }) => {
                return isDeleted ? null : image
            }
        })
    }
})