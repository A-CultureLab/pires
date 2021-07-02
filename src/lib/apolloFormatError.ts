import { GraphQLError } from "graphql"
import winston from 'winston'
import { LoggingWinston } from '@google-cloud/logging-winston'

const loggingWinston = new LoggingWinston()

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        loggingWinston,
    ]
})

const formatError = (error: GraphQLError): GraphQLError => {
    let errorMessage = ''
    console.log(error.message)
    // try {
    //     if (error.message.substr(0, ERROR_SIMBOL.length) === ERROR_SIMBOL) errorMessage = error.message.substr(ERROR_SIMBOL.length)
    //     else {
    //         logger.error(error.message + ' stack : ' + error.stack)
    //         errorMessage = '알 수 없는 오류'
    //     }
    // } catch (error) {
    //     errorMessage = '알 수 없는 오류'
    // }

    return {
        ...error,
        extensions: {
            ...error.extensions,
            exception: error.extensions ? {
                ...error.extensions.exception,
                stacktrace: []
            } : undefined
        },
        message: errorMessage
    }
}

export default formatError