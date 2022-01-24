import { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'

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
        process.env.NODE_ENV === 'production' ? undefined : false,
    })
  )
  /**
   * Compression
   */
  app.use(compression())
}
