import { extendType, nonNull, stringArg } from 'nexus'

import { createReport } from '../../services/airtable/createReport'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('reportsSubmitAbuse', {
      type: 'Boolean',
      description: 'Create an abuse report',
      args: {
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
