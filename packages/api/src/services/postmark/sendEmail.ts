import { captureException, Scope } from '@sentry/node'
import { Logger } from '../../helpers/console'

import { API_TOKEN, client } from './client'

const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL

export interface EmailData {
  email: string
  name: string
  templateModel: Record<string, string>
}

export const sendEmail = async (
  templateId: string,
  { name, email, templateModel }: EmailData,
  additionalLogs?: () => void
): Promise<void> => {
  if (process.env.ENV === `development`) {
    Logger.log()
    Logger.log(`To: ${name} – ${email}`)
    Logger.log(`TemplateId – ${templateId}`)
    Logger.log()
    if (additionalLogs) {
      additionalLogs()
      Logger.log()
    }

    return
  }

  if (API_TOKEN === 'fake' || !FROM_EMAIL || !templateId) {
    Logger.error(
      `Please specify the POSTMARK_FROM_EMAIL and POSTMARK_API_TOKEN env variables.`
    )

    return
  }

  try {
    await client.sendEmailWithTemplate({
      To: email,
      From: FROM_EMAIL!,
      TemplateId: Number(templateId),
      TemplateModel: {
        name,
        ...templateModel,
      },
    })
  } catch (err) {
    const errMsg = `Failed to send email for template ${templateId} to ${email}`
    Logger.error(errMsg, err)
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
      })
    )
  }
}
