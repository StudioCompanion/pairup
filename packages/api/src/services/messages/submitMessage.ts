import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'

import { Logger } from '../../helpers/console'
import { sendMessage } from '../emails/sendMessage'

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
  if (!ctx.user.userId) {
    throw new Error('User must be logged in')
  }

  try {
    const { message, sessionId } = args

    const parsedMessage = submitMessageSchema.parse({ message })

    const session = await ctx.prisma.session.findFirst({
      where: {
        id: sessionId,
        pairerId: ctx.user.userId,
      },
      include: {
        pairer: true,
        pairee: true,
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
        sentBy: 'PAIRER',
        sessionId: session.id,
      },
    })

    const allMessagesForSession = await ctx.prisma.message.findMany({
      where: {
        sessionId: session.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    await sendMessage(session, allMessagesForSession)

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
