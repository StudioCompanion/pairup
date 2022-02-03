import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import Airtable from 'airtable'
import { Logger } from '../../helpers/console'
import { captureException, Scope } from '@sentry/node'

type Dictionary = { [index: string]: string }

const SEVERITY_MAP: Dictionary = {
  'Spam or harmful': 'MEDIUM',
  'Harassment or bullying': 'HIGH',
  'Pretending to be someone': 'HIGH',
  'Something else': 'LOW',
}

const severity = (abuseType: string) => {
  for (const key in SEVERITY_MAP) {
    if (abuseType === key) return SEVERITY_MAP[key]
  }
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
  abuseType: z.enum([
    'Spam or harmful',
    'Harassment or bullying',
    'Pretending to be someone',
    'Something else',
  ]),
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

      await base('Reports').create({
        Name: name,
        Email: email,
        'Incident description': description,
        'Nature of the abuse': abuseType,
        'Is the abuser a Pairer?': isAbuserPairer,
        Status: 'New',
        Severity: severity(abuseType),
      })
      return {
        success: true,
        ReportError: [],
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
          ReportError: err.issues.map((issue) => ({
            errorCode: 'Invalid',
            input: issue.path[0].toString(),
            message: issue.message,
          })),
        }
      }

      captureException(
        { errMsg, name, email, description, isAbuserPairer, abuseType },
        new Scope().setExtras({
          err,
          name,
          email,
          description,
          isAbuserPairer,
          abuseType,
        })
      )
      return {
        success: false,
        ReportError: [],
      }
    }
  }
