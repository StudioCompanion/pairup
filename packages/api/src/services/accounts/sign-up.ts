import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { formatISO } from 'date-fns'
import { DAYS_OF_THE_WEEK, PAIRER_PROFILE_STATUS } from '@pairup/shared'

import { prisma } from '../../db/prisma'

import { createOrUpdateDocument } from '../sanity/createOrUpdateDocument'

import { Logger } from '../../helpers/console'

import { NexusGenInputs } from '../../graphql/nexus-types.generated'

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
  jobTitle: z.string(),
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

    /**
     * Create our user
     */
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    /**
     * Begin creating the Sanity Profile entry
     */
    const { availability, ...restProfile } = profile

    const now = formatISO(Date.now())

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

    await createOrUpdateDocument({
      _type: 'pairerProfile',
      _id: user.userId,
      uuid: user.userId,
      title: `${restProfile.firstName} ${restProfile.lastName}`,
      status: PAIRER_PROFILE_STATUS.AWAITING_APPROVAL,
      email,
      hasVerifiedAccount: false,
      createdAt: now,
      lastModifiedAt: now,
      ...restProfile,
      ...allAvailability,
      disciplines: restProfile.disciplines.join(','),
    })

    return {
      User: user,
      UserError: null,
    }
  } catch (err: unknown) {
    Logger.error(err)

    if (err instanceof ZodError) {
      return {
        User: null,
        UserError: err.issues.map((issue) => ({
          errorCode: 'The input value is invalid, see message',
          input: issue.path.slice(-1)[0].toString(),
          message: issue.message,
        })),
      }
    }
    if (err instanceof PrismaClientKnownRequestError) {
      return {
        User: null,
        UserError: [
          {
            errorCode: 'The input value is invalid, see message',
            input: 'email',
            message: 'This email address has already been used',
          },
        ],
      }
    }

    return {
      User: null,
      UserError: [],
    }
  }
}
