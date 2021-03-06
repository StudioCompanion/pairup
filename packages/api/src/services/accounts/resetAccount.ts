import { FieldResolver } from 'nexus'
import { JsonWebTokenError } from 'jsonwebtoken'
import { z, ZodError } from 'zod'
import { captureException, Scope } from '@sentry/node'
import bcrypt from 'bcrypt'
import { add } from 'date-fns'

import { Logger } from '../../helpers/console'
import { createToken, verifyUserToken } from '../../helpers/tokens'
import { NoUserError } from '../../helpers/errors'

const resetSchema = z.object({
  resetToken: z.string({ required_error: 'ResetToken is required' }).nonempty(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
      message:
        'Password must be at least 8 characters long, contain 1 special character, 1 number, 1 capital and 1 lowercase letter',
    }),
})

export const resetAccount: FieldResolver<'Mutation', 'userReset'> = async (
  _,
  args,
  ctx
) => {
  const { prisma } = ctx

  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    throw new Error('No JWT_SECRET – cannot verify any tokens')
  }

  try {
    resetSchema.parse(args)

    const { password, resetToken } = args

    /**
     * This will throw if _either_ the resetToken isn't legit
     * or if it wasn't made with our secret
     */
    const user = await verifyUserToken(resetToken)

    /**
     * If the reset token doesn't match
     * the token in the DB then return an error,
     * this can happen if someone is using a token
     * that has already been used or in the
     * unlikely situation that a token has been generated
     * by a different service without appending the database
     */
    if (user.resetToken !== resetToken) {
      return {
        User: null,
        UserAccessToken: null,
        UserInputError: [
          {
            errorCode: 'Invalid',
            input: 'resetToken',
            message: 'Invalid resetToken provided',
          },
        ],
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    /**
     * Void all access tokens by changing their personalKey
     */

    const personalKey = await bcrypt.genSalt(6)

    const updatedUser = await prisma.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        resetToken: '',
        password: hashedPassword,
        personalKey,
      },
    })

    const token = createToken(
      {
        userId: user.userId,
      },
      updatedUser.personalKey,
      {
        expiresIn: '7d',
      }
    )

    const expiresAt = add(Date.now(), {
      days: 7,
    })

    return {
      User: updatedUser,
      UserAccessToken: {
        accessToken: token,
        expiresAt,
      },
      UserInputError: [],
    }
  } catch (err) {
    const errMsg = 'Failed to reset user'
    Logger.error(errMsg, err)

    if (err instanceof JsonWebTokenError) {
      throw err
    }

    if (err instanceof NoUserError) {
      return {
        User: null,
        UserAccessToken: null,
        UserInputError: [
          {
            errorCode: 'NotFound',
            input: 'resetToken',
            message: 'No user found using the reset token provided',
          },
        ],
      }
    }

    if (err instanceof ZodError) {
      /**
       * One of our schemas failed validation check
       * Send back the input name which is the last
       * in the path array
       */
      return {
        User: null,
        UserAccessToken: null,
        UserInputError: err.issues.map((issue) => ({
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
      })
    )
    return {
      User: null,
      UserAccessToken: null,
      UserInputError: [],
    }
  }
}
