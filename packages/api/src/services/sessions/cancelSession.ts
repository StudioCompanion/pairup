import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'

import { Logger } from '../../helpers/console'
import { sendCancelledSessionEmail } from '../emails/sendCancelledSessionEmail'

export const cancelSession: FieldResolver<'Mutation', 'sessionCancel'> = async (
  _,
  args,
  ctx
) => {
  const { sessionId } = args
  const { prisma, user } = ctx
  if (!user.userId) {
    throw new Error('User must be logged in')
  }
  try {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    })

    const isAttachedToUser = session?.pairerId === user.userId

    /**
     * We dont have this session
     */
    if (!session || !isAttachedToUser) {
      return {
        sessionId: '',
        SessionInputError: [
          {
            errorCode: 'NotFound',
            message: 'Session not found with provided id',
            input: 'sessionId',
          },
        ],
      }
    }

    if (session.status !== 'ACTIVE') {
      return {
        sessionId: '',
        SessionInputError: [
          {
            errorCode: 'PastEvent',
            message: 'Session not found with provided id in User',
            input: 'sessionId',
          },
        ],
      }
    }

    const updatedSession = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        status: 'CANCELLED',
      },
    })

    await sendCancelledSessionEmail(updatedSession.email)

    return {
      sessionId: updatedSession.id,
      SessionInputError: [],
    }
  } catch (err) {
    const errMsg = 'Failed to cancel session'
    Logger.error(errMsg, err)

    captureException(
      errMsg,
      new Scope().setExtras({
        err,
        sessionId,
      })
    )

    return {
      sessionId: null,
      SessionInputError: [],
    }
  }
}
