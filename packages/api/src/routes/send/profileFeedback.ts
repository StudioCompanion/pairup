import { captureException, Scope } from '@sentry/node'
import { RequestHandler } from 'express'
import { z, ZodError } from 'zod'

import { sendProfileFeedbackEmail } from '../../services/emails/sendProfileFeedbackEmail'

export interface ProfileFeedbackRequestBody {
  userProfile?: {
    firstName?: string
    email?: string
  }
  feedback?: string
}

type ProfileFeedbackResponseBody = string

const requestBodySchema = z.object({
  userProfile: z.object({
    name: z.string(),
    email: z.string(),
  }),
  feedback: z.string(),
})

export const profileFeedback: RequestHandler<
  null,
  ProfileFeedbackResponseBody,
  ProfileFeedbackRequestBody
> = async (req, res) => {
  try {
    const { userProfile, feedback } = requestBodySchema.parse(req.body)

    await sendProfileFeedbackEmail(
      userProfile.name,
      userProfile.email,
      feedback
    )

    res.status(200).send(JSON.stringify({ success: true }))
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).send(JSON.stringify(err))
    }

    const msg = 'Failed to send email to user about live profile'
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
