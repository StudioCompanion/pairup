import { Logger } from '../../helpers/console'

import {
  EmailData,
  sendEmailWithTemplate,
} from '../postmark/sendEmailWithTemplate'

const TEMPLATE_ID = process.env.POSTMARK_TEMPLATE_ID_VERIFY

/**
 * Send a verification email with Postmark
 *
 * @example
 * ```ts
 * sendEmailWithTemplate({
 *   to: user.email,
 *   subject: `Welcome to ${appName}!`,
 *   text: `We're happy to have you...`
 * })
 * ```
 */
export const sendVerificationEmail = async (
  email: string,
  verificationCode: string,
  { name }: Pick<EmailData, 'name'>
) => {
  const verificationEmail = `https://www.pairup.com${'a'}?code=${verificationCode}`

  const templateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
    action_url: verificationEmail,
    login_url: 'https://www.pairup.com',
    sender_name: 'Josh',
    company_name: 'PairUp',
    company_address: 'My house',
    username: email,
  }

  if (!TEMPLATE_ID) {
    Logger.warn('No TEMPLATE_ID set for sending a verification email')
    return
  }

  await sendEmailWithTemplate(
    TEMPLATE_ID,
    { name, email, templateModel },
    () => {
      // only printed in development
      Logger.log(`sent verification email with code: ${verificationCode}`)
    }
  )
}
