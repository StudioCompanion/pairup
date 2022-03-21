import { captureException, Scope } from '@sentry/node'
import { RequestHandler } from 'express'

import { Logger } from '../../helpers/console'

const PAIRUP_TOKEN_HEADER = 'X-Pairup-Secret-Token'

export const verifyApiKey: RequestHandler = (req, res, next) => {
  if (process.env.ENV !== 'production') {
    return next()
  } 

  try {
    const apiKey = process.env.GRAPHQL_API_SECRET

    if (!apiKey) {
      return res
        .status(500)
        .send(
          'No API key configured on the server, no requests will be handled'
        )
    }

    const token = req.get(PAIRUP_TOKEN_HEADER)

    if (!token) {
      return res.status(401).send('No token present')
    }

    if (token !== apiKey) {
      return res.status(401).send('Incorrect token provided')
    }

    next()
  } catch (err) {
    const msg = 'Failed to verify PairUp token'
    Logger.error(msg, err)
    captureException(
      msg,
      new Scope().setExtras({
        err,
        data: req.body,
      })
    )
    res.status(500).send(JSON.stringify(err))
  }
}
