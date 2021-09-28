

import { objectType } from "nexus";

export const PostImage = objectType({
    name: 'PostImage',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.url()
        t.model.post()
        t.model.postId()
    }
})