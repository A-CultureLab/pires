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

    process.env.NODE_ENV !== 'production' && console.log(error.message) // 디버깅용

    if (error.extensions?.log) {
        console.error(error)
        process.env.NODE_ENV === 'production' && logger.error(error)
    }

    return error
}

export default formatError