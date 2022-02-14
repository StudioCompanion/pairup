import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'

import { Logger } from '../../helpers/console'
import { sendCancelledSessionEmail } from '../emails/sendCancelledSessionEmail'

export const deleteAccount: FieldResolver<'Mutation', 'userDeleteAccount'> =
  async (_, _args, ctx) => {
    const {
      user: { userId },
      prisma,
    } = ctx

    if (!userId) {
      throw new Error('User must be logged in')
    }

    /**
     * Get sessions for user
     */
    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
        sessions: true,
      },
    })

    if (!user) {
      throw new Error('User must be logged in')
    }

    try {
      /**
       * Delete sessions for user
       */
      await prisma.session.deleteMany({
        where: {
          pairerId: userId,
        },
      })

      /**
       * Email those pairees about
       * their cancelled sessions
       */
      await Promise.all(
        user.sessions
          .filter((sesh) => sesh.status === 'ACTIVE')
          .map((sesh) => sendCancelledSessionEmail(sesh.email))
      )

      return {
        success: true,
      }
    } catch (err) {
      const errMsg = 'Failed to delete user account'
      Logger.error(errMsg, err)

      /**
       * Any other error, capture it & return a failed object
       */
      captureException(
        errMsg,
        new Scope().setExtras({
          err,
          userId,
        })
      )
      return {
        success: false,
      }
    }
  }
