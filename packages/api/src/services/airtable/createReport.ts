import { FieldResolver } from 'nexus'
import { z, ZodError } from 'zod'
import Airtable from 'airtable'
import { Logger } from '../../helpers/console'

import { captureException, Scope } from '@sentry/node'

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
})

export const createReport: FieldResolver<'Mutation', 'reportsSubmitAbuse'> =
  async (_, args) => {
    const { name, email, description, isAbuserPairer, abuseType } = args.report

    abuseReportSchema.parse({ name, email, description })

    const base = new Airtable({
      apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
    }).base('appt58t6XthcfoN5i')

    try {
      await base('Reports').create({
        Name: name,
        Email: email,
        'Incident description': description,
        'Nature of the abuse': abuseType,
        'Is the abuser a Pairer?': isAbuserPairer,
      })
      return {
        success: true,
        ReportError: {message: null, input:null},
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
          Report: null,
          ReportError: err.issues.map((issue) => {
            message: issue.message
          }),
        }
      }

      captureException(
        errMsg,
        new Scope().setExtras({
          err,
        })
      )
      return {
        success: false,
        Report: null,
        ReportError: [],
      }
    }
  }
