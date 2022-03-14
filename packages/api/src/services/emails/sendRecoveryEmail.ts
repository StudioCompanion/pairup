import { Logger } from '../../helpers/console'
import { sendEmail } from '../postmark/sendEmail'

const TEMPLATE_ID = process.env.POSTMARK_TEMPLATE_ID_RECOVER

export const sendRecoveryEmail = async (email: string, resetToken: string) => {
  const recoverUrl = `https://www.pairup.com${'a'}?code=${resetToken}`

  const templateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
    recoverUrl,
  }

  if (!TEMPLATE_ID) {
    Logger.warn('No TEMPLATE_ID set for sending a new user email')
    return
  }

  await sendEmail(TEMPLATE_ID, { email, templateModel }, () => {
    // only printed in development
    Logger.log(
      `sent email with a link to recover account with token: ${resetToken}`
    )
  })
}
