import { makeSchema, queryType } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars'
import { GraphQLScalarType } from 'graphql'

import * as scalars from './scalars'
import * as types from './types'
import * as querys from './querys'
import * as mutations from './mutations'
import * as subscriptions from './subscriptions'
import * as crud from './CRUD'




const schema = makeSchema({
    types: [scalars, types, querys, mutations, crud, subscriptions],
    shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
    outputs: {
        schema: __dirname + '/../../schema.graphql',
        typegen: __dirname + '/../../generated/nexus.d.ts'
    },
    contextType: {
        module: require.resolve('../context'),
        export: 'Context',
    },
    sourceTypes: {
        modules: [
            {
                module: require.resolve('.prisma/client/index.d.ts'),
                alias: 'prisma',
            },
        ],
    },
    plugins: [nexusPrisma({
        experimentalCRUD: true,
        paginationStrategy: 'prisma',
        scalars: {
            DateTime: DateTimeResolver,
            // Json: new GraphQLScalarType({
            //     ...JSONObjectResolver,
            //     name: 'Json',
            // })
        }
    })],
})


export default schema