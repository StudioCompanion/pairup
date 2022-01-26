import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import * as Sentry from '@sentry/node'

import { schema } from '../graphql/schema'
import { prisma } from '../db/prisma'

import { applyMiddleware } from './middleware'
import { handleNoRoute } from './404'

const PORT = process.env.PORT || 3000
const isProduction = process.env.ENV === 'production'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GraphQLContext {}

async function startApolloServer() {
  const app = express()

  if (isProduction) {
    Sentry.init({ dsn: process.env.SENTRY_DNS })
  }

  applyMiddleware(app)

  app.use(Sentry.Handlers.requestHandler())

  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema,
    context: (): GraphQLContext => ({
      prisma,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  server.applyMiddleware({ app })

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  )

  app.use(Sentry.Handlers.errorHandler())

  handleNoRoute(app)

  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
}

startApolloServer()
