import { objectType } from "nexus";

export const Follow = objectType({
    name: 'Follow',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.targetUser()
        t.model.user()
        t.model.targetUserId()
        t.model.userId()
    }
})