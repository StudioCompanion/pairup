import { captureException, Scope } from '@sentry/node'
import e, { RequestHandler } from 'express'

import { sendProfileLiveEmail } from '../../../services/emails/sendProfileLiveEmail'

interface PairerProfileRequestBody {
  uuid?: string | null
  email?: string | null
  firstName?: string | null
  lastName?: string | null
}

type PairerProfileResponse = string

export const pairerProfilePublished: RequestHandler<
  null,
  PairerProfileResponse,
  PairerProfileRequestBody
> = async (req, res) => {
  try {
    const { email } = req.body
    if (email) {
      await sendProfileLiveEmail(email)
      res.status(200).end()
    } else {
      throw new Error('No email provided')
    }
  } catch (err) {
    const msg = 'Failed to send email to user about live profile'
    console.error(msg, err)
    captureException(
      msg,
      new Scope().setExtras({
        err,
        data: req.body,
      })
    )
    res.status(400).end()
  }
}
