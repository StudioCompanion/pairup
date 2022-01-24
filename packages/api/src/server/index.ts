import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'

import { schema } from '../graphql/schema'
import { prisma } from '../db/prisma'

import { applyMiddleware } from './middleware'
import { handleNoRoute } from './404'

const PORT = process.env.PORT || 3000

export interface GraphQLContext {
  prisma: typeof prisma
}

async function startApolloServer() {
  const app = express()

  applyMiddleware(app)

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

  handleNoRoute(app)

  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
}

startApolloServer()
