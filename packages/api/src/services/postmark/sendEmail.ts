import { captureException, Scope } from '@sentry/node'
import { Message } from 'postmark'
import { Logger } from '../../helpers/console'

import { API_TOKEN, client } from './client'

export const sendEmail = async (
  message: Message,
  additionalLogs?: () => void
): Promise<void> => {
  if (process.env.ENV === `development`) {
    Logger.log()
    Logger.log(`To: ${message.To}`)
    Logger.log()
    if (additionalLogs) {
      additionalLogs()
      Logger.log()
    }

    return
  }

  if (API_TOKEN === 'fake') {
    Logger.error(`Please specify the POSTMARK_API_TOKEN env variable.`)

    return
  }

  try {
    await client.sendEmail({
      ...message,
    })
  } catch (err) {
    const errMsg = `Failed to send email to ${message.To}`
    Logger.error(errMsg, err)
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
      })
    )
  }
}
