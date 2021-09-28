import { list, mutationField, nonNull, nullable, stringArg } from "nexus";
import { uploadImage as imageUploader } from "../../lib/googleCloudStorage";


export const uploadImage = mutationField(t => t.nonNull.field('uploadImage', {
    type: 'String',
    args: {
        image: nonNull('Upload'),
        path: nullable(stringArg())
    },
    resolve: async (_, { image, path }, ctx) => {
        const uri = await imageUploader(image, path || undefined)
        return uri
    }
}))


export const uploadImages = mutationField(t => t.nonNull.list.nonNull.field('uploadImages', {
    type: 'String',
    args: {
        images: nonNull(list(nonNull('Upload'))),
        path: nullable(stringArg())
    },
    resolve: async (_, { images, path }, ctx) => {
        const uris = await Promise.all(images.map(image => imageUploader(image, path || '')))
        return uris
    }
}))