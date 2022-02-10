import { inputObjectType } from 'nexus'

export const SessionCreatePaireeInputType = inputObjectType({
  name: 'SessionCreatePaireeInput',
  description: 'Pairee details and information for creating a session',
  definition: (t) => {
    t.nonNull.string('firstName')
    t.string('lastName')
    t.nonNull.string('email')
    t.string('jobTitle')
    t.string('portfolio')
    t.nonNull.string('timezone')
    t.nonNull.string('appointment')
    t.list.field('subjects', {
      type: 'UserDisciplines',
    })
    t.nonNull.string('message')
  },
})
