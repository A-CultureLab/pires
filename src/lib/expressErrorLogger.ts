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

//@ts-ignore
const expressErrorLogger = (err, req, res, next) => {
    console.error(err)
    logger.error(err.message)
    next(err)
}


export default expressErrorLogger