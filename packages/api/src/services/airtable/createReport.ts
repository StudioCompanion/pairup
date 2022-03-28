import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import Airtable from 'airtable'
import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { NexusGenEnums } from '../../graphql/nexus-types.generated'
import { sendNewAbuseReportedEmail } from '../emails/sendNewAbuseReportedEmail'

export type AbuseReportRow = {
  Name?: string
  Email?: string
  'Incident description'?: string
  'Nature of the abuse'?: NexusGenEnums['Abuse']
  'Is the abuser a Pairer?'?: boolean
  Status?: string
  Severity?: string
}

const ABUSE_TYPE_OPTIONS = [
  'Spam or harmful',
  'Harassment or bullying',
  'Pretending to be someone',
  'Something else',
] as const

enum ReportSeverity {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

const SEVERITY_MAP: Record<NexusGenEnums['Abuse'], ReportSeverity> = {
  [ABUSE_TYPE_OPTIONS[0]]: ReportSeverity.MEDIUM,
  [ABUSE_TYPE_OPTIONS[1]]: ReportSeverity.HIGH,
  [ABUSE_TYPE_OPTIONS[2]]: ReportSeverity.HIGH,
  [ABUSE_TYPE_OPTIONS[3]]: ReportSeverity.LOW,
}

const abuseReportSchema = z.object({
  name: z.string().nonempty({
    message: 'Name is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Invalid email address provided',
    })
    .nonempty(),
  description: z.string().nonempty({
    message: 'Description is required',
  }),
  isAbuserPairer: z.boolean({
    required_error: 'isAbuserPairer is required',
    invalid_type_error: 'isActive must be a boolean',
  }),
  abuseType: z.enum(ABUSE_TYPE_OPTIONS),
})

export const createReport: FieldResolver<
  'Mutation',
  'reportsSubmitAbuse'
> = async (_, args) => {
  try {
    const { name, email, description, isAbuserPairer, abuseType } = args.report

    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_REPORTS_ID) {
      throw new Error('Unable to submit report, no API key or Base ID')
    }

    abuseReportSchema.parse({
      name,
      email,
      description,
      isAbuserPairer,
      abuseType,
    })

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_REPORTS_ID)

    const reportRecord = await base<AbuseReportRow>('Reports').create({
      Name: name,
      Email: email,
      'Incident description': description,
      'Nature of the abuse': abuseType,
      'Is the abuser a Pairer?': isAbuserPairer,
      Status: 'New',
      Severity: SEVERITY_MAP[abuseType],
    })

    await sendNewAbuseReportedEmail(reportRecord)

    return {
      success: true,
      ReportInputError: [],
    }
  } catch (err: unknown) {
    const errMsg = 'Failed to create report'
    Logger.error(errMsg, err)

    if (err instanceof ZodError) {
      /**
       * the reportAbuse schema has failed validation,
       * so we're sending back the error messages from zod
       */
      return {
        success: false,
        ReportInputError: err.issues.map((issue) => ({
          errorCode: 'Invalid',
          input: issue.path[0].toString(),
          message: issue.message,
        })),
      }
    }

    captureException(
      args.report,
      new Scope().setExtras({
        err,
        report: args.report,
      })
    )
    return {
      success: false,
      ReportInputError: [],
    }
  }
}
