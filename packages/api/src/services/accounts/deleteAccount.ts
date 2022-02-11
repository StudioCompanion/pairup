import { captureException, Scope } from '@sentry/node'
import { FieldResolver } from 'nexus'

import { Logger } from '../../helpers/console'

export const deleteAccount: FieldResolver<'Mutation', 'userDeleteAccount'> =
  async (_, _args, ctx) => {
    const {
      user: { userId },
      prisma,
    } = ctx

    if (!userId) {
      throw new Error('User must be logged in')
    }

    try {
      /**
       * Get sessions for user
       */
      const { sessions } = (await prisma.user.findUnique({
        where: {
          userId,
        },
        include: {
          sessions: true,
        },
      }))!

      /**
       * Delete sessions for user
       */
      await prisma.session.deleteMany({
        where: {
          pairerId: userId,
        },
      })

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
