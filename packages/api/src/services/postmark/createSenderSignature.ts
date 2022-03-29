import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { admin, ADMIN_API_TOKEN } from './client'

interface SenderSignatureUser {
  firstName: string
  lastName?: string
  userId: string
}

export const createSenderSignature = async <TUser extends SenderSignatureUser>(
  user: TUser,
  additionalLogs?: () => void
) => {
  try {
    if (process.env.ENV === `development`) {
      Logger.log()
      Logger.log(`PaireeAlias: ${user.userId}@pair-up.co.uk`)
      Logger.log()
      if (additionalLogs) {
        additionalLogs()
        Logger.log()
      }

      return
    }

    if (ADMIN_API_TOKEN === 'fake') {
      Logger.error(`Please specify the POSTMARK_API_TOKEN env variable.`)

      return
    }

    await admin.createSenderSignature({
      Name: `${user.firstName} ${user.lastName}`,
      FromEmail: `${user.userId}@pair-up.co.uk`,
    })
  } catch (err) {
    const errMsg = `Failed to create Sender Signature for alias – ${user.userId}`
    Logger.error(errMsg, err)
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
        uuid: user.userId,
      })
    )
  }
}
