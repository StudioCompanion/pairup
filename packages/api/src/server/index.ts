import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import * as Sentry from '@sentry/node'
import { PrismaClient } from '@prisma/client'
import * as admin from 'firebase-admin'

import { schema } from '../graphql/schema'

import { prisma } from '../db/prisma'

import {
  AuthenticatedUser,
  verifyAuthToken,
} from '../services/tokens/verifyAuthToken'
import { verifySanityToken } from '../services/sanity/verifySanityToken'

import { pairerProfilePublished } from '../routes/webhooks/sanity/pairerProfilePublished'
import { profileFeedback } from '../routes/send/profileFeedback'
import { rejectProfile } from '../routes/send/rejectProfile'

import { Logger } from '../helpers/console'

import { applyMiddleware } from './middleware'
import { handleNoRoute } from './404'

const PORT = process.env.PORT || 3000
const isProduction = process.env.ENV === 'production'

export interface GraphQLContext {
  prisma: PrismaClient
  user: AuthenticatedUser
}

async function startApolloServer() {
  /**
   * this could be undefined if we don't
   * have the keys in the ENV
   */
  try {
    const serviceAccount = require('../../pairup-firebase.json')

    admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
      },
      'pairup'
    )
  } catch (err) {
    const msg =
      'No credentials found for firebase, cloud messenging will not work. \n'
    Logger.warn(msg, err)
    Sentry.captureException(msg)
  }

  const app = express()

  if (isProduction) {
    Sentry.init({ dsn: process.env.SENTRY_DNS })
  }

  applyMiddleware(app)

  app.use(Sentry.Handlers.requestHandler())

  app.post('/webhooks/sanity/pairer-profile-published', pairerProfilePublished)

  app.post('/send/profileFeedback', verifySanityToken, profileFeedback)
  app.post('/send/rejectProfile', verifySanityToken, rejectProfile)

  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema,
    context: async ({ req }): Promise<GraphQLContext> => ({
      prisma,
      user: await verifyAuthToken(req),
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
