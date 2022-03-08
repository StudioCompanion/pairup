import { captureException, Scope } from '@sentry/node'
import { RequestHandler } from 'express'
import { z, ZodError } from 'zod'

import { sendProfileLockEmail } from '../../services/emails/sendProfileLockEmail'

export interface ProfileLockRequestBody {
  userProfile?: {
    firstName?: string
    email?: string
  }
  feedback?: string
}

type ProfileLockResponseBody = string

const requestBodySchema = z.object({
  userProfile: z.object({
    name: z.string(),
    email: z.string(),
  }),
  feedback: z.string(),
})

export const lockProfile: RequestHandler<
  null,
  ProfileLockResponseBody,
  ProfileLockRequestBody
> = async (req, res) => {
  try {
    const { userProfile, feedback } = requestBodySchema.parse(req.body)

    await sendProfileLockEmail(userProfile.name, userProfile.email, feedback)

    res.status(200).send(JSON.stringify({ success: true }))
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).send(JSON.stringify(err))
    }

    const msg = 'Failed to send email to user about locking profile'
    console.error(msg, err)
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
