import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import bcrypt from 'bcrypt'
import { add } from 'date-fns'

import { Logger } from '../../helpers/console'
import { createToken } from '../../helpers/tokens'

import { prisma } from '../../db/prisma'

import { NexusGenRootTypes } from '../../graphql/nexus-types.generated'

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Invalid email address provided',
    })
    .nonempty(),
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

const NO_MATCH_MSG = 'Email and Password combination does not match records'
const NO_MATCH_ERROR: Array<NexusGenRootTypes['InputErrors']> = [
  {
    errorCode: 'NotFound',
    input: 'email',
    message: NO_MATCH_MSG,
  },
  {
    errorCode: 'NotFound',
    input: 'password',
    message: NO_MATCH_MSG,
  },
]

export const createAccessToken: FieldResolver<
  'Mutation',
  'userCreateAccessToken'
> = async (_, { password, email }) => {
  try {
    schema.parse({
      email,
      password,
    })

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return {
        UserAccessToken: null,
        UserInputError: NO_MATCH_ERROR,
      }
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return {
        UserAccessToken: null,
        UserInputError: NO_MATCH_ERROR,
      }
    }

    const token = createToken(
      {
        userId: user.userId,
      },
      user.personalKey,
      {
        expiresIn: '7d',
      }
    )

    const expiresAt = add(Date.now(), {
      days: 7,
    })

    return {
      UserAccessToken: token
        ? {
            accessToken: token,
            expiresAt: expiresAt,
          }
        : null,
      UserInputError: [],
    }
  } catch (err: unknown) {
    const errMsg = 'Failed to create access token for user'
    Logger.error(errMsg, err)

    if (err instanceof ZodError) {
      /**
       * One of our schemas failed validation check
       * Send back the input name which is the last
       * in the path array
       */
      return {
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
      UserAccessToken: null,
      UserInputError: [],
    }
  }
}
