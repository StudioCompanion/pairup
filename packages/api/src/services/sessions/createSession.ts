import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'

import { Logger } from '../../helpers/console'

const paireeDetailsSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .nonempty({
      message: 'First name required',
    }),
  lastName: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Invalid email address provided',
    })
    .nonempty(),
  jobTitle: z.string().optional(),
  portfolio: z.string().optional(),
  timezone: z
    .string({
      required_error: 'Timezone is required',
      invalid_type_error: 'Timezone must be a string',
    })
    .nonempty({
      message: 'Timezone is required',
    }),
  /**
   * TODO: we could parse this and check
   * that both sides to the time frame
   * are a timestamp.
   */
  appointment: z
    .string({
      required_error: 'Appointment is required',
      invalid_type_error: 'Appointment must be a string',
    })
    .nonempty('an appointment timeframe is required'),
  subjects: z.array(z.string()).optional(),
  message: z
    .string({
      required_error: 'Message is required',
      invalid_type_error: 'Message must be a string',
    })
    .nonempty('a message is required'),
})

export const createSession: FieldResolver<'Mutation', 'sessionCreate'> = async (
  _,
  args,
  ctx
) => {
  try {
    const { pairerId, paireeDetails } = args

    const parsedDetails = paireeDetailsSchema.parse(paireeDetails)

    /**
     * Test if pairerId is even a real ID
     */
    const pairer = await ctx.prisma.user.findUnique({
      where: {
        userId: pairerId,
      },
    })

    if (!pairer) {
      return {
        Session: null,
        SessionInputError: [
          {
            errorCode: 'NotFound',
            input: 'pairerId',
            message: 'No pairer found with this ID',
          },
        ],
      }
    }

    const createdSession = await ctx.prisma.session.create({
      data: {
        ...parsedDetails,
        pairerId,
      },
    })

    return {
      Session: {
        ...createdSession,
      },
      SessionInputError: [],
    }
  } catch (err) {
    const errMsg = 'Failed to create session'
    Logger.error(errMsg, err)

    if (err instanceof ZodError) {
      return {
        Session: null,
        SessionInputError: err.issues.map((issue) => ({
          errorCode: 'Invalid',
          input: issue.path.slice(-1)[0].toString(),
          message: issue.message,
        })),
      }
    }

    captureException(
      errMsg,
      new Scope().setExtras({
        err,
        session: args.paireeDetails,
        pairerId: args.pairerId,
      })
    )
    return {
      Session: null,
      SessionInputError: [],
    }
  }
}
