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

export default handler().use(
  new ApolloServer({
    schema,
    context: ({ req }): GraphQLContext => ({
      user: req.user,
      origin: getRequestOrigin(req),
      prisma,
    }),
  }).createHandler({
    path: '/api',
  })
)
