import { mutationField, nonNull, nullable, stringArg } from "nexus";
import { uploadImage as imageUploader } from "../../lib/googleCloudStorage";


export const uploadImage = mutationField(t => t.field('uploadImage', {
    type: 'String',
    args: {
        image: nonNull('Upload'),
        path: nullable(stringArg())
    },
    resolve: async (_, { image, path }, ctx) => {
        const uri = await imageUploader(image, path)
        return uri
    }
}))