import { ApolloServer } from 'apollo-server-micro'

import prisma from 'db/prisma'
import { getRequestOrigin } from 'server/middleware/get-request-origin'
import { schema } from 'server/graphql/schema'
import handler from 'server/middleware/api-route'

export const config = {
  api: {
    bodyParser: false,
  },
}

export interface GraphQLContext {
  user?: Express.User
  prisma: typeof prisma
  origin: string
}

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }): GraphQLContext => ({
      user: req.user,
      origin: getRequestOrigin(req),
      prisma,
    }),
  })
  await server.start()
  server.createHandler({
    path: '/api',
  })

  return server
}

export default handler().use(startServer)
