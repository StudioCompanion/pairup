import { Logger } from '../../helpers/console'
import { sendEmailWithTemplate } from '../postmark/sendEmailWithTemplate'

const TEMPLATE_ID = process.env.POSTMARK_TEMPLATE_ID_CANCELLED_SESSION

export const sendCancelledSessionEmail = async (email: string) => {
  const templateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
  }

  if (!TEMPLATE_ID) {
    Logger.warn('No TEMPLATE_ID set for sending a profile live email')
    return
  }

  await sendEmailWithTemplate(TEMPLATE_ID, {
    email,
    templateModel,
  })
}
