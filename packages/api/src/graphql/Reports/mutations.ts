import { extendType, nonNull } from 'nexus'

import { createReport } from '../../services/airtable/createReport'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('reportsSubmitAbuse', {
      type: 'Boolean',
      description: 'Create an abuse report',
      args: {
        report: nonNull('ReportAbuseInput'),
      },
      resolve: createReport,
    })
  },
})
