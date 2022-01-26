import { Logger } from '../../helpers/console'

import { sendEmail } from '../postmark/sendEmail'

const TEMPLATE_ID = process.env.POSTMARK_TEMPLATE_ID_VERIFY
const ADMIN_EMAIL_ADDRESS = process.env.POSTMARK_ADMIN_EMAIL

export const sendNewUserEmail = (id: string) => {
  const templateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
    action_url: ` https://pairup.sanity.studio/desk/pairerProfiles;${id}`,
  }

  if (!TEMPLATE_ID || !ADMIN_EMAIL_ADDRESS) {
    Logger.warn(
      'No TEMPLATE_ID or ADMIN_EMAIL_ADDRESS set for sending a new user email'
    )
    return
  }

  sendEmail(
    TEMPLATE_ID,
    { name: 'Admin', email: ADMIN_EMAIL_ADDRESS, templateModel },
    () => {
      // only printed in development
      Logger.log(`sent email with a link to pairer profile with id: ${id}`)
    }
  )
}
