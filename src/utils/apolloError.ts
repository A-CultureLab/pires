import { ApolloError } from "apollo-server-errors";

export type ErrorCode =
    'LOGIN_REQUIRE'
    | 'IMAGE_UPLOAD_FAIL'
    | 'INVALID_ID'
    | 'NO_PERMISSION'
    | 'INVALID_ARGS'
    | 'NOT_MATCH'

const apolloError = (
    message: string,
    code: ErrorCode,
    option?: {
        log?: boolean,
        notification?: boolean, // 앱에서 toast 띄울지 말지
        metaError?: any
    }
) => new ApolloError(message, code, {
    log: true,
    notification: true,
    ...option
})

export default apolloError