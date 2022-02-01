import { inputObjectType, objectType, enumType } from 'nexus'

export const AbuseTypeType = enumType({
  name: 'AbuseType',
  description: 'The type of abuse',
  members: {
    TYPE_1: 'Spam or harmful',
    TYPE_2: 'Harassment or bullying',
    TYPE_3: 'Pretending to be someone',
    TYPE_4: 'Something else',
  },
})

export const ReportAbuseInputType = inputObjectType({
  name: 'ReportAbuseInput',
  definition: (t) => {
    t.nonNull.string('name')
    t.nonNull.string('email')
    t.nonNull.string('description')
    t.nonNull.boolean('isAbuserPairer')
    t.field('type', {
      type: AbuseTypeType,
    })
  },
})

// export const ReportAbuseInputMutationReturnType = objectType({
//   name: 'ReportAbuseInputMutationReturn',
//   description:
//     'Encapsulates return values of report mutations where input values could be incorrect',
//   definition: (t) => {
//     t.field('ReportAbuseInput', {
//       type: 'ReportAbuseInput'
//     })
//   },
// })
