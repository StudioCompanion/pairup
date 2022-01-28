import { inputObjectType } from 'nexus'

export const ReportAbuseInputType = inputObjectType({
  name: 'ReportAbuseInput',
  definition(t) {
    t.nonNull.string('Name')
    t.nonNull.string('Email')
    t.nonNull.string('Incident Description')
    t.nonNull.string('Pairer or Pairee')
    t.nonNull.boolean('Is the abuser a pairer?')
    t.nonNull.string('Nature of the abuse')
  },
})
