import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import bcrypt from 'bcrypt'
import { add } from 'date-fns'

import { Logger } from '../../helpers/console'
import { createToken } from '../../helpers/tokens'

/**
 * Schema validation for detail args
 */
const detailsSchema = z
  .object({
    email: z.string().email({
      message: 'Invalid email address provided',
    }),
    password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
          'Password must be at least 8 characters long, contain 1 special character, 1 number, 1 capital and 1 lowercase letter',
      }),
  })
  .partial()

/**
 * Schema validation for a time object
 * passed from GraphQL
 */
const timeSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
})

/**
 * Schema validation for the
 * user's profile
 */
const profileSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    jobTitle: z.string(),
    companyUrl: z.string(),
    portfolioUrl: z.string(),
    bio: z.string(),
    disciplines: z.array(z.string()),
    twitter: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
    github: z.string(),
    timezone: z.string(),
    availability: z
      .object({
        monday: z.array(timeSchema),
        tuesday: z.array(timeSchema),
        wednesday: z.array(timeSchema),
        thursday: z.array(timeSchema),
        friday: z.array(timeSchema),
        saturday: z.array(timeSchema),
        sunday: z.array(timeSchema),
      })
      .partial(),
  })
  .partial()
  .optional()

export const updateAccount: FieldResolver<'Mutation', 'userUpdateAccount'> =
  async (_, args, ctx) => {
    const { email, password, profile } = args
    const {
      prisma,
      user: { userId },
    } = ctx
    /**
     * We don't want to catch this error,
     * we just want to straight up reject it.
     */
    if (!userId) {
      throw new Error('User must be logged in')
    }
    /**
     * Also if someone calls the mutation with no parameter
     * throw an error, they shouldn't do that.
     */
    if (!email && !password && !profile) {
      throw new Error(
        'Mutation userUpdateAccount requires at least one parameter'
      )
    }

    try {
      /**
       * Parse the email & Password
       * through the schema
       */
      detailsSchema.parse({
        email,
        password,
      })

      /**
       * Parse the profile too
       */
      profileSchema.parse(profile)

      /**
       * Handle updating password
       */
      if (password) {
        const user = (await prisma.user.findUnique({
          where: {
            userId,
          },
        }))!

        const arePasswordsTheSame = await bcrypt.compare(
          password,
          user.password
        )

        if (arePasswordsTheSame) {
          return {
            UserAccessToken: null,
            UserError: [
              {
                errorCode: 'Invalid',
                input: 'password',
                message: 'New password cannot be the same as old password',
              },
            ],
          }
        }

        const newPassword = await bcrypt.hash(password, 10)

        await prisma.user.update({
          where: {
            userId,
          },
          data: {
            password: newPassword,
          },
        })
      }

      const newToken = createToken(
        {
          userId,
        },
        {
          expiresIn: '7d',
        }
      )

      const expiresAt = add(Date.now(), {
        days: 7,
      })

      return {
        UserAccessToken: newToken
          ? {
              accessToken: newToken,
              expiresAt,
            }
          : null,
        UserError: [],
      }
    } catch (err: unknown) {
      const errMsg = 'Failed to update user account'
      Logger.error(errMsg, err)

      if (err instanceof ZodError) {
        /**
         * One of our schemas failed validation check
         * Send back the input name which is the last
         * in the path array
         */
        return {
          UserAccessToken: null,
          UserError: err.issues.map((issue) => ({
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
        UserError: [],
      }
    }
  }
