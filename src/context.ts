import { PrismaClient, User } from '@prisma/client'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

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
    userId?: string
}

export const createContext = async (expressContext: ExpressContext): Promise<Context> => {
    // const user = await getIUser({ expressContext } as Context, true)

    return {
        prisma,
        expressContext,
        pubsub,
        // user
    }
}