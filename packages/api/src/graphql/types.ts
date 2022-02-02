import { objectType } from 'nexus'
import { ErrorCodesType } from './enums'

export const ErrorType = objectType({
  name: 'Error',
  description: 'An error that has happened when submitting an abuse report',
  definition: (t) => {
    t.string('message')
    t.string('input')
    t.list.field('ReportErrorCodes', {
      type: ErrorCodesType,
    })
  },
})
