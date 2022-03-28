import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'

import { Logger } from '../../helpers/console'

const submitMessageSchema = z.object({
  message: z
    .string({
      required_error: 'Message is required',
      invalid_type_error: 'Message must be a string',
    })
    .nonempty('a message is required'),
})

export const submitMessage: FieldResolver<'Mutation', 'messageSubmit'> = async (
  _,
  args,
  ctx
) => {
  try {
    const { message, sessionId } = args

    const parsedMessage = submitMessageSchema.parse({ message })

    const session = await ctx.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    })

    if (!session) {
      return {
        Message: null,
        MessageInputError: [
          {
            errorCode: 'NotFound',
            input: 'sessionId',
            message: 'No session found with this ID',
          },
        ],
      }
    }

    const createdMessage = await ctx.prisma.message.create({
      data: {
        ...parsedMessage,
        sessionId: session.id,
      },
    })

    return {
      Message: {
        ...createdMessage,
      },
      MessageInputError: [],
    }
  } catch (err) {
    const errMsg = 'Failed to submit message'
    Logger.error(errMsg, err)

    if (err instanceof ZodError) {
      return {
        Message: null,
        MessageInputError: err.issues.map((issue) => ({
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
        sessionId: args.sessionId,
      })
    )
    return {
      Message: null,
      MessageInputError: [],
    }
  }
}
