import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import morgan from 'morgan'
import hpp from 'hpp'
import helmet from 'helmet'
import { createContext } from './context'
import expressErrorLogger from './lib/expressErrorLogger'
import apolloFormatError from './lib/apolloFormatError'
import schema from './nexus'


require('dotenv').config()

// express 설정
const app = express()

// 환경별 미들웨어
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')) //log 용
  app.use(hpp()) // 보안
  app.use(helmet()) // 보안
} else {
  app.use(morgan('dev')) //log 용
}
// 기타 미들웨어
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressErrorLogger)
// routing

app.get('/isRunning', (req, res) => res.send('Server is running')) // 서버 구동 확인용 router

// apollo 설정
const apolloServer = new ApolloServer({
  schema,
  context: createContext,
  formatError: apolloFormatError,
  uploads: { maxFileSize: 10 * 1024 * 1024, maxFiles: 10 },
  playground: process.env.NODE_ENV === 'production' ? false : { settings: { "request.credentials": 'include' } }
})

apolloServer.applyMiddleware({
  app,
  path: '/graphql',
  cors: { credentials: true, origin: process.env.NODE_ENV === 'production' ? 'https://38do.com' : '*' }
})



const port = 8080

const server = app.listen({ port }, () => {
  process.send && process.send('ready')
  console.log(`🚀  Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
})

process.on('SIGINT', () => {
  server.close((err) => {
    console.log('server closed')
    process.exit(err ? 1 : 0)
  })
})