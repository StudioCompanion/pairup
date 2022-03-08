import { Logger } from '../../helpers/console'
import { sendEmail } from '../postmark/sendEmail'

const TEMPLATE_ID = process.env.POSTMARK_TEMPLATE_ID_LOCK_PROFILE

export const sendProfileLockEmail = async (
  name: string,
  email: string,
  feedback: string
) => {
  const templateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
    feedback,
  }

  if (!TEMPLATE_ID) {
    Logger.warn('No TEMPLATE_ID set for sending a profile live email')
    return
  }

  await sendEmail(TEMPLATE_ID, { name, email, templateModel })
}
