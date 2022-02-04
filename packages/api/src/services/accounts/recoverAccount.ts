import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'

import { Logger } from '../../helpers/console'
import { createToken } from '../../helpers/tokens'

import { sendRecoveryEmail } from '../emails/sendRecoveryEmail'

const recoverSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Invalid email address provided',
    })
    .nonempty(),
})

export const recoverAccount: FieldResolver<'Mutation', 'userRecover'> = async (
  _,
  args,
  ctx
) => {
  try {
    const { prisma } = ctx
    const { email } = recoverSchema.parse(args)

    /**
     * Check if the email exists as a user
     */
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      const { userId } = user

      /**
       * Create a reset token,
       * we'll send this to as
       * part of the recovery
       * email to the user
       */
      const resetToken = createToken(
        {
          resetUserId: userId,
        },
        {
          expiresIn: '1d',
        }
      )

      sendRecoveryEmail(email, resetToken)
    }

    /**
     * We send success either way
     * because really, people shouldn't
     * know if an account with the email exists
     */
    return {
      success: true,
      Error: [],
    }
  } catch (err) {
    const errMsg = 'Failed to recover user'
    Logger.error(errMsg, err)

    if (err instanceof ZodError) {
      /**
       * One of our schemas failed validation check
       * Send back the input name which is the last
       * in the path array
       */
      return {
        success: false,
        Error: err.issues.map((issue) => ({
          errorCode: 'Invalid',
          input: issue.path.slice(-1)[0].toString(),
          message: issue.message,
        })),
      }
    }

    /**
     * Any other error, capture it & return a failed object
     */
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
        email: args.email,
      })
    )
    return {
      success: false,
      Error: [],
    }
  }
}
