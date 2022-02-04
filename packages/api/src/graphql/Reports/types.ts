import { inputObjectType, objectType } from 'nexus'
import { AbuseType } from './enums'
import { NexusGenEnums } from '../nexus-types.generated'

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

export const ReportSubmitAbusePayloadType = objectType({
  name: 'ReportSubmitAbusePayload',
  description:
    'Encapsulates return values of report mutations where input values could be incorrect',
  definition: (t) => {
    t.boolean('success')
    t.list.field('ReportInputError', {
      type: 'InputErrors',
    })
  },
})

export type AbuseReportRow = {
  Name?: string
  Email?: string
  'Incident description'?: string
  'Nature of the abuse'?: NexusGenEnums['Abuse']
  'Is the abuser a Pairer?'?: boolean
  Status?: string
  Severity?: string
}
