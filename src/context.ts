import { PrismaClient } from '@prisma/client'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub()
export const prisma = new PrismaClient()


export interface Context {
    prisma: PrismaClient
    expressContext: ExpressContext
    pubsub: PubSub
}

export const createContext = (expressContext: ExpressContext): Context => {
    return {
        prisma,
        expressContext,
        pubsub
    }
}