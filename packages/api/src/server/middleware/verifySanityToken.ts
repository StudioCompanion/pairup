import { captureException, Scope } from '@sentry/node'
import { createHmac } from 'crypto'
import { RequestHandler } from 'express'

import { Logger } from '../../helpers/console'

import { ProfileFeedbackRequestBody } from '../../routes/send/profileFeedback'

const SANITY_TOKEN_HEADER = 'X-Sanity-Secret-Token'

export const verifySanityToken: RequestHandler<
  null,
  string,
  ProfileFeedbackRequestBody
> = (req, res, next) => {
  try {
    if (!process.env.SANITY_SECRET) {
      throw new Error('No SANITY_SECRET available, unable to verify')
    }

    const token = req.get(SANITY_TOKEN_HEADER)

    if (typeof token !== 'string') {
      res.status(401).send('Valid token not found')
    }

    const hash = createHmac('sha256', process.env.SANITY_SECRET)
      .update(JSON.stringify(req.body))
      .digest('base64')

    if (hash !== token) {
      res.status(401).send('Invalid token used')
    }

    next()
  } catch (err) {
    const msg = 'Failed to verify Sanity Token'
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
