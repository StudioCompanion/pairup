import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import bcrypt from 'bcrypt'
import { add, formatISO } from 'date-fns'
import { PAIRER_PROFILE_STATUS } from '@pairup/shared'
import { nanoid } from 'nanoid'
import { IdentifiedSanityDocumentStub } from '@sanity/client'

import { Logger } from '../../helpers/console'
import { createToken } from '../../helpers/tokens'

import { NexusGenInputs } from '../../graphql/nexus-types.generated'
import { updateDocument } from '../sanity/updateDocument'
import { getDocument } from '../sanity/getDocument'
import { SanityDocumentTypes } from '../../constants'

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
    firstName: z.string().nonempty({
      message: 'First name is required',
    }),
    lastName: z.string().nonempty({
      message: 'Last name is required',
    }),
    jobTitle: z.string().nonempty({
      message: 'Your job title is required',
    }),
    companyUrl: z.string().nonempty(),
    portfolioUrl: z.string().nonempty(),
    bio: z.string().nonempty({
      message: 'Your bio is required',
    }),
    disciplines: z
      .array(z.string(), {
        required_error: 'You have to select at least one discipline',
      })
      .nonempty(),
    twitter: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
    github: z.string(),
    timezone: z.string().nonempty(),
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

type UpdatedAvailability = Record<
  string,
  Array<NexusGenInputs['AvailabilityTimeInput']>
>

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
      const parsedProfile = profileSchema.parse(profile)

      /**
       * Prisma entry handling
       */
      if (password || email) {
        const user = (await prisma.user.findUnique({
          where: {
            userId,
          },
        }))!

        let dbUpdates = {}

        if (password) {
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

          dbUpdates = {
            ...dbUpdates,
            password: newPassword,
          }
        }

        if (email) {
          if (email === user.email) {
            return {
              UserAccessToken: null,
              UserError: [
                {
                  errorCode: 'Invalid',
                  input: 'email',
                  message: 'New email cannot be the same as old email',
                },
              ],
            }
          }

          dbUpdates = {
            ...dbUpdates,
            email,
          }
        }

        if (Object.keys(dbUpdates).length > 0) {
          /**
           * TODO: probably need to revalidate
           * the email of the user?
           */
          await prisma.user.update({
            where: {
              userId,
            },
            data: {
              ...dbUpdates,
            },
          })
        }
      }

      /**
       * Sanity Profile handling
       */
      const hasProfileBeenPublished = await getDocument(userId)
      const now = Date.now()
      const formattedTime = formatISO(now)

      const { availability, ...restProfile } = parsedProfile ?? {}

      let updatedAvailability: UpdatedAvailability = {}

      if (availability) {
        updatedAvailability = Object.entries(availability).reduce(
          (acc, [day, hours]) => {
            acc[day] = hours.map((hour) => ({
              ...hour,
              _type: 'availableTime',
              _key: `${userId}_${nanoid()}`,
            }))
            return acc
          },
          {} as UpdatedAvailability
        )

        if (hasProfileBeenPublished) {
          /**
           * If the profile has been updated we
           * want to make sure it can be republished
           * straight away to avoid schedule conflicts
           */
          await updateDocument({
            _type: SanityDocumentTypes.PAIRER_PROFILE,
            _id: userId,
            lastModifiedAt: formattedTime,
            ...updatedAvailability,
          })
        }
      }

      /**
       * If we actually have the values,
       * then update the sanity profile
       */
      if (restProfile || email) {
        let draftProfileUpdates: IdentifiedSanityDocumentStub = {
          _type: SanityDocumentTypes.PAIRER_PROFILE,
          _id: `drafts.${userId}`,
          status: PAIRER_PROFILE_STATUS.AWAITING_APPROVAL,
          lastModifiedAt: formattedTime,
          ...restProfile,
          ...updatedAvailability,
        }

        if (restProfile.disciplines) {
          draftProfileUpdates = {
            ...draftProfileUpdates,
            disciplines: restProfile.disciplines.join(','),
          }
        }

        if (email) {
          draftProfileUpdates = {
            ...draftProfileUpdates,
            email,
          }
        }

        await updateDocument(draftProfileUpdates)
      }

      /**
       * Create a new access token for the user
       */
      const newToken = createToken(
        {
          userId,
        },
        {
          expiresIn: '7d',
        }
      )

      const expiresAt = add(now, {
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
