import { Logger } from '../../helpers/console'
import { sendEmail } from '../postmark/sendEmail'

const TEMPLATE_ID = process.env.POSTMARK_TEMPLATE_ID_NEW_SESSION

export const sendNewSessionEmail = async (
  pairerEmail: string,
  paireeEmail: string
) => {
  const pairerTemplateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
  }

  const paireeTemplateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
  }

  if (!TEMPLATE_ID) {
    Logger.warn('No TEMPLATE_ID set for sending a profile live email')
    return
  }

  await sendEmail(TEMPLATE_ID, {
    email: pairerEmail,
    templateModel: pairerTemplateModel,
  })

  await sendEmail(TEMPLATE_ID, {
    email: paireeEmail,
    templateModel: paireeTemplateModel,
  })
}
