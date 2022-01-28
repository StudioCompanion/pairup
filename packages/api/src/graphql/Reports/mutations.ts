import { extendType, nonNull, stringArg, booleanArg } from 'nexus'
import { boolean, string } from 'zod'

import { createReport } from '../../services/airtable/createReport'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('reportsSubmitAbuse', {
      type: 'Boolean',
      description: 'Create an abuse report',
      args: {
        // report: nonNull('ReportAbuseInput'),
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        incidentDescription: nonNull(stringArg()),
        pairerOrPairee: nonNull(stringArg()),
        natureOfAbuse: nonNull(stringArg()),
        pairer: nonNull(stringArg()),
      },
      resolve: createReport,
    })
  },
})
