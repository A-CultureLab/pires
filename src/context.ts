import { PrismaClient, User } from '@prisma/client'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';
import jwt from 'jsonwebtoken'


const {
    REDIS_HOSTNAME,
    NODE_ENV,
} = process.env;


const redisOption: RedisOptions = {
    host: REDIS_HOSTNAME,
    port: 6379,
    retryStrategy: attempt => Math.max(attempt * 100, 3000),

}

export const pubsub = NODE_ENV === 'production'
    ? new RedisPubSub({
        subscriber: new Redis(redisOption),
        publisher: new Redis(redisOption)
    })
    : new PubSub()

export const prisma = new PrismaClient()


export interface Context {
    prisma: PrismaClient
    expressContext: ExpressContext
    pubsub: PubSub | RedisPubSub
    iUserId: string
    iUser: User
}

export const createContext = async (expressContext: ExpressContext): Promise<Context> => {

    // 유저 세부 정보들 담기
    let iUserId = ''
    let iUser = null
    try {
        const verify = jwt.verify(expressContext.req.headers.accessToken as string || '', process.env.JWT_SECRET) as { userId: string }
        iUserId = verify.userId
        iUser = await prisma.user.findUnique({ where: { id: iUserId } })
    } catch (error) { }

    return {
        prisma,
        expressContext,
        pubsub,
        iUserId,
        iUser
    } as Context
}