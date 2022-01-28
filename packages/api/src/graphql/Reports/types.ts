import { inputObjectType } from 'nexus'

export const ReportAbuseInputType = inputObjectType({
  name: 'ReportAbuseInput',
  definition(t) {
    t.nonNull.string('name')
    t.nonNull.string('email')
    t.nonNull.string('incidentDescription')
    t.nonNull.string('pairerOrPairee')
    t.nonNull.string('pairer')
    t.nonNull.string('natureOfAbuse')
  },
})
