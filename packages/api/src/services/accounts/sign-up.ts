import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { formatISO, add } from 'date-fns'
import { DAYS_OF_THE_WEEK, PAIRER_PROFILE_STATUS } from '@pairup/shared'
import { captureException, Scope } from '@sentry/node'
import { randomBytes } from 'crypto'

import { prisma } from '../../db/prisma'

import { createOrUpdateDocument } from '../sanity/createOrUpdateDocument'

import { Logger } from '../../helpers/console'

import { NexusGenInputs } from '../../graphql/nexus-types.generated'

import { sendVerificationEmail } from '../emails/sendVerificationEmail'
import { sendNewUserEmail } from '../emails/sendNewUserEmail'

/**
 * Schema validation for signing up
 */
const signupSchema = z.object({
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

/**
 * Schema validation for a time object
 * passed from GraphQL
 */
const timeSchema = z.object({
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
})

/**
 * Schema validation for the
 * user's profile
 */
const profileSchema = z.object({
  firstName: z.string().nonempty({
    message: 'First name is required',
  }),
  lastName: z.string().nonempty({
    message: 'Last name is required',
  }),
  jobTitle: z.string().nonempty({
    message: 'Your job title is required',
  }),
  companyUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  bio: z.string().nonempty({
    message: 'Your bio is required',
  }),
  disciplines: z
    .array(z.string(), {
      required_error: 'You have to select at least one discipline',
    })
    .nonempty(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  timezone: z.string().nonempty({
    message: 'Timezone is required',
  }),
  availability: z
    .object(
      {
        monday: z.array(timeSchema),
        tuesday: z.array(timeSchema),
        wednesday: z.array(timeSchema),
        thursday: z.array(timeSchema),
        friday: z.array(timeSchema),
        saturday: z.array(timeSchema),
        sunday: z.array(timeSchema),
      },
      {
        required_error: 'Availability is required',
      }
    )
    .partial(),
})

export const signup: FieldResolver<'Mutation', 'userCreateAccount'> = async (
  _,
  args
) => {
  const { email, password, profile } = args

  try {
    /**
     * Parse the email & Password
     * through the schema
     */
    signupSchema.parse({
      email,
      password,
    })

    /**
     * Parse the profile too
     */
    profileSchema.parse(profile)

    /**
     * Hash the password
     */
    const hashedPassword = await bcrypt.hash(password, 10)

    const now = Date.now()

    const verificationCode = randomBytes(32).toString('base64')
    const verificationTimeout = formatISO(
      add(now, {
        days: 1,
      })
    )

    /**
     * Create our user
     */
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationCode,
        verificationTimeout,
      },
    })

    /**
     * Begin creating the Sanity Profile entry
     */
    const { availability, ...restProfile } = profile

    /**
     * Make a default object shape of availability
     * so the client of GraphQL doesnt have too
     */
    const allAvailability = Object.values(DAYS_OF_THE_WEEK)
      .map((day) => {
        const hours = availability[day] ?? []

        return {
          [day]: hours.map(
            (hour: NexusGenInputs['AvailabilityTimeInput'] | null) => ({
              ...hour,
              _type: 'availableTime',
              _key: `${user.userId}_${day}`,
            })
          ),
        }
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})

    /**
     * Create the sanity document
     * If this fails it's tracked in Sentry,
     * If the pairer doesn't have a profile
     * they will be a bit broken so someone
     * has to do something manual
     */
    await createOrUpdateDocument(
      {
        _type: 'pairerProfile',
        _id: user.userId,
        uuid: user.userId,
        title: `${restProfile.firstName} ${restProfile.lastName}`,
        status: PAIRER_PROFILE_STATUS.AWAITING_APPROVAL,
        email,
        hasVerifiedAccount: false,
        createdAt: formatISO(now),
        lastModifiedAt: formatISO(now),
        ...restProfile,
        ...allAvailability,
        disciplines: restProfile.disciplines.join(','),
      },
      true
    )

    /**
     * Send a verification email to the new pairer
     * If this fails Sentry will be notified,
     * with the verification code in the DB we'll
     * have to fetch it out there
     */
    sendVerificationEmail(user.email, verificationCode, {
      name: restProfile.firstName,
    })

    /**
     * Send email to super user so they can approve the profile.
     */
    sendNewUserEmail(user.userId)

    return {
      User: user,
      UserError: null,
    }
  } catch (err: unknown) {
    const errMsg = 'Failed to create user account'
    Logger.error(errMsg, err)

    if (err instanceof ZodError) {
      /**
       * One of our schemas failed validation check
       * Send back the input name which is the last
       * in the path array
       */
      return {
        User: null,
        UserError: err.issues.map((issue) => ({
          errorCode: 'Invalid',
          input: issue.path.slice(-1)[0].toString(),
          message: issue.message,
        })),
      }
    }
    if (err instanceof PrismaClientKnownRequestError) {
      /**
       * I've assumed this will only happen if
       * an email has already been used,
       * lets pray I was right.
       */
      return {
        User: null,
        UserError: [
          {
            errorCode: 'Invalid',
            input: 'email',
            message: 'This email address has already been used',
          },
        ],
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
      UserError: [],
    }
  }
}
