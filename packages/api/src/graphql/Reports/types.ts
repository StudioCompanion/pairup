import { inputObjectType, objectType } from 'nexus'
import { AbuseType, ReportErrorCodesType } from './enums'

export const ReportAbuseInputType = inputObjectType({
  name: 'ReportAbuseInput',
  definition: (t) => {
    t.nonNull.string('name')
    t.nonNull.string('email')
    t.nonNull.string('description')
    t.nonNull.boolean('isAbuserPairer')
    t.nonNull.field('abuseType', {
      type: AbuseType,
    })
  },
})

export const ReportErrorType = objectType({
  name: 'ReportError',
  description: 'An error that has happened when submitting an abuse report',
  definition: (t) => {
    t.string('message')
    t.list.field('ReportErrorCodes', {
      type: ReportErrorCodesType,
    })
  },
})

export const ReportAbuseInputMutationPayloadType = objectType({
  name: 'ReportAbuseInputMutationPayload',
  description:
    'Encapsulates return values of report mutations where input values could be incorrect',
  definition: (t) => {
    t.boolean('success')
    t.list.field('ReportError', {
      type: ReportErrorType,
    })
  },
})
