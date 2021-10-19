import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import hpp from 'hpp'
import helmet from 'helmet'
import { createContext } from './context'
import expressErrorLogger from './lib/expressErrorLogger'
import apolloFormatError from './lib/apolloFormatError'
import schema from './nexus'
import { createServer } from 'http'
import 'dayjs/locale/ko'
import dayjs from 'dayjs';

import newsRouter from './routes/news'

dayjs.locale('ko')


require('dotenv').config()

const {
  NODE_ENV
} = process.env

// express 설정
const app = express()

// 환경별 미들웨어
if (NODE_ENV === 'production') {
  // app.use(morgan('combined')) //log 용
  app.use(hpp()) // 보안
  app.use(helmet()) // 보안
} else {
  // app.use(morgan('dev')) //log 용
}
// 기타 미들웨어
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressErrorLogger)
// app.use((req, res, next) => { // delay
//   if (NODE_ENV === 'production') return next()
//   else setTimeout(() => next(), 500)
// })

// Restapi routing
app.get('/isRunning', (req, res) => res.send('Server is running')) // 서버 구동 확인용 router
app.use('/news', newsRouter)


const httpServer = createServer(app)
// apollo 설정
const apolloServer = new ApolloServer({
  schema,
  context: createContext,
  formatError: apolloFormatError,
  plugins: NODE_ENV === 'production' ? [] : [
    // ApolloLogPlugin({})
  ],
  subscriptions: {
    onConnect: async (connectionParams, _webSocket, _context) => {
      console.log('Connected to websocket')
      return { connectionParams }
    },
    onDisconnect: async (webSocket, context) => {
      console.log('Disconnected')
    }
  },
  uploads: { maxFileSize: 10 * 1024 * 1024, maxFiles: 10 },
  playground: process.env.NODE_ENV === 'production' ? false : { settings: { "request.credentials": 'include' } }
})

apolloServer.applyMiddleware({
  app,
  path: '/graphql',
  cors: { credentials: true, origin: NODE_ENV === 'production' ? 'https://38do.kr' : '*' }
})
apolloServer.installSubscriptionHandlers(httpServer)


const port = process.env.PORT || 8080

httpServer.listen({ port }, () => {
  console.log(`🚀  Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
})
