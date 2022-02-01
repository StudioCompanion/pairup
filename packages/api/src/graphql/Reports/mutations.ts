import { extendType, nonNull } from 'nexus'
import {
  ReportAbuseInputType,
  ReportAbuseInputMutationPayloadType,
} from './types'
import { createReport } from '../../services/airtable/createReport'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('reportsSubmitAbuse', {
      type: ReportAbuseInputMutationPayloadType,
      description: 'Create an abuse report',
      args: {
        report: nonNull(ReportAbuseInputType),
      },
      resolve: createReport,
    })
  },
})
