/* eslint-disable no-console */
import { info } from 'next/dist/build/output/log'

import { client, API_TOKEN } from 'server/postmark/client'

type EmailUserData = {
  firstName: string
}

const TEMPLATE_ID = process.env.VERIFICATION_EMAIL_TEMPLATE_ID
const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL

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
export const sendVerificationEmail = (
  email: string,
  { firstName }: EmailUserData
) => {
  if (process.env.NODE_ENV === `development`) {
    info(`not sending email in development:`)
    console.log()
    console.log(`To: ${firstName} – ${email}`)
    console.log(`TemplateId – ${0}`)
    console.log()
    console.log('some info')
    console.log()
    return
  }

  if (API_TOKEN === 'fake' || !FROM_EMAIL || !TEMPLATE_ID) {
    console.error(
      `Please specify the POSTMARK_FROM_EMAIL and POSTMARK_API_TOKEN env variables.`
    )
    return
  }

  return client.sendEmailWithTemplate({
    To: email,
    From: FROM_EMAIL,
    TemplateId: Number(TEMPLATE_ID),
    TemplateModel: {
      product_url: 'pairup.com',
      product_name: 'Pair Up',
      name: firstName,
      action_url: 'https://www.pairup.com/api/verify-account?account',
      login_url: 'https://www.pairup.com/login',
      username: email,
      sender_name: 'Josh',
      company_name: 'PairUp',
      company_address: 'My house',
    },
  })
}
