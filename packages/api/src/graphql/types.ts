import { objectType } from 'nexus'

export const InputErrorsType = objectType({
  name: 'InputErrors',
  description: 'An error that has happened when interacting with the API',
  definition: (t) => {
    t.string('message')
    t.string('input')
    t.field('errorCode', {
      type: 'ErrorCodes',
    })
  },
})
