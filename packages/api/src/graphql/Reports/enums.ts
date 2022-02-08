import { enumType } from 'nexus'

export const AbuseType = enumType({
  name: 'Abuse',
  description: 'The type of abuse',
  members: {
    SPAM_OR_HARMFUL: 'Spam or harmful',
    HARASSMENT_OR_BULLYING: 'Harassment or bullying',
    PRETENDING_TO_BE_SOMEONE: 'Pretending to be someone',
    SOMETHING_ELSE: 'Something else',
  },
})
