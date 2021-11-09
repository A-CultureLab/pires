import axios from "axios";
import { objectType } from "nexus";
import apolloError from "../../utils/apolloError";

export const Media = objectType({
    name: 'Media',
    definition(t) {
        t.model.id()
        t.model.createdAt()
        t.model.images()
        t.model.content()
        t.model.isInstagram()
        t.model.user()
        t.model.tagedPets()
        t.model.likedUsers()
        t.model.mediaComment()
        t.model.userId()
    }
})