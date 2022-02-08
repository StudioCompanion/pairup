import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import Airtable from 'airtable'

import { Logger } from '../../helpers/console'
import { captureException, Scope } from '@sentry/node'

import { NexusGenEnums } from '../../graphql/nexus-types.generated'
import { AbuseReportRow, ABUSE_TYPE_OPTIONS } from '../../graphql/Reports/types'

enum ReportSeverity {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
const SEVERITY_MAP: Record<NexusGenEnums['Abuse'], ReportSeverity> = {
  ['Spam or harmful']: ReportSeverity.MEDIUM,
  ['Harassment or bullying']: ReportSeverity.HIGH,
  ['Pretending to be someone']: ReportSeverity.HIGH,
  ['Something else']: ReportSeverity.LOW,
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

export const createReport: FieldResolver<'Mutation', 'reportsSubmitAbuse'> =
  async (_, args) => {
    const { name, email, description, isAbuserPairer, abuseType } = args.report

    abuseReportSchema.parse({
      name,
      email,
      description,
      isAbuserPairer,
      abuseType,
    })

    try {
      const base = new Airtable({
        apiKey: process.env.AIRTABLE_API_KEY,
      }).base('appt58t6XthcfoN5i')

      await base<AbuseReportRow>('Reports').create({
        Name: name,
        Email: email,
        'Incident description': description,
        'Nature of the abuse': abuseType,
        'Is the abuser a Pairer?': isAbuserPairer,
        Status: 'New',
        Severity: SEVERITY_MAP[abuseType],
      })
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
