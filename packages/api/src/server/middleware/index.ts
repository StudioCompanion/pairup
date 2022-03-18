import { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import { requireSignedRequest } from '@sanity/webhook'

import { GRAPHQL_PATH } from '../../constants'
import { verifySanityToken } from './verifySanityToken'
import { verifyApiKey } from './verifyApiKey'

export const applyMiddleware = (app: Express) => {
  /**
   * BodyParser
   */
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  /**
   * Cors
   */
  app.use(cors())
  /**
   * Helmet
   */

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy:
        process.env.ENV === 'production' ? undefined : false,
    })
  )
  /**
   * Compression
   */
  app.use(compression())

  app.use(
    '/webhooks/sanity/*',
    requireSignedRequest({ secret: process.env.SANITY_SECRET ?? '' })
  )

  app.use('/send/:route', verifySanityToken)

  /**
   * TODO: add some CORS to this route
   */
  app.use(GRAPHQL_PATH, verifyApiKey)
}
