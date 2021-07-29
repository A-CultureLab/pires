import { PrismaClient, User } from '@prisma/client'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { PubSub } from 'graphql-subscriptions';
import getIUser from './utils/getIUser';

export const pubsub = new PubSub()
export const prisma = new PrismaClient()


export interface Context {
    prisma: PrismaClient
    expressContext: ExpressContext
    pubsub: PubSub
    // user: User | null
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