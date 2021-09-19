/* eslint-disable no-console */
import { info } from 'next/dist/build/output/log'
import { POST_API_SLUGS } from 'references/slugs'

import { client, API_TOKEN } from 'server/services/postmark/client'

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
  verificationCode: string,
  { firstName }: EmailUserData
) => {
  const verificationEmail = `https://www.pairup.com${POST_API_SLUGS.ACCOUNTS_VERIFY_EMAIL}?code=${verificationCode}`

  if (process.env.NODE_ENV === `development`) {
    info(`not sending email in development:`)
    console.log()
    console.log(`To: ${firstName} – ${email}`)
    console.log(`TemplateId – ${TEMPLATE_ID}`)
    console.log()
    console.log(`This link will verify the user ${verificationEmail}`)
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
      action_url: verificationEmail,
      login_url: 'https://www.pairup.com/login',
      username: email,
      sender_name: 'Josh',
      company_name: 'PairUp',
      company_address: 'My house',
    },
  })
}
