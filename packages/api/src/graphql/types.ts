import { objectType } from 'nexus'

export const ErrorType = objectType({
  name: 'InputError',
  description: 'An error that has happened when submitting an abuse report',
  definition: (t) => {
    t.string('message')
    t.string('input')
    t.field('errorCode', {
      type: 'ErrorCodes',
    })
  },
})
