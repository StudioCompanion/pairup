import { Logger } from '../../helpers/console'
import { sendEmailWithTemplate } from '../postmark/sendEmailWithTemplate'

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
    Logger.warn('No TEMPLATE_ID set for sending a profile lock email')
    return
  }

  await sendEmailWithTemplate(TEMPLATE_ID, { name, email, templateModel })
}
