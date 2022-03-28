import { Record } from 'airtable'

import { Logger } from '../../helpers/console'
import { sendEmailWithTemplate } from '../postmark/sendEmailWithTemplate'

import type { AbuseReportRow } from '../airtable/createReport'

const TEMPLATE_ID = process.env.POSTMARK_TEMPLATE_ID_NEW_REPORT
const ADMIN_EMAIL_ADDRESS = process.env.POSTMARK_ADMIN_EMAIL

export const sendNewAbuseReportedEmail = async (
  reportRecord: Record<AbuseReportRow>
) => {
  const templateModel = {
    product_url: 'pairup.com',
    product_name: 'Pair Up',
    reportUrl: `https://airtable.com/${
      process.env.AIRTABLE_REPORTS_ID
    }/tblYNGUfquRPtfXuq/${reportRecord.getId()}`,
  }

  if (!TEMPLATE_ID || !ADMIN_EMAIL_ADDRESS) {
    Logger.warn(
      'No TEMPLATE_ID or ADMIN_EMAIL_ADDRESS set for sending a new abuse report email'
    )
    return
  }

  await sendEmailWithTemplate(
    TEMPLATE_ID,
    {
      email: ADMIN_EMAIL_ADDRESS,
      templateModel,
    },
    () => {
      Logger.log('REPORT URL >>>> ', templateModel.reportUrl)
    }
  )
}
