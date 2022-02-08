import { enumType } from 'nexus'
import { ABUSE_TYPE_OPTIONS } from './types'

export const AbuseType = enumType({
  name: 'Abuse',
  description: 'The type of abuse',
  members: {
    SPAM_OR_HARMFUL: ABUSE_TYPE_OPTIONS[0],
    HARASSMENT_OR_BULLYING: ABUSE_TYPE_OPTIONS[1],
    PRETENDING_TO_BE_SOMEONE: ABUSE_TYPE_OPTIONS[2],
    SOMETHING_ELSE: ABUSE_TYPE_OPTIONS[3],
  },
})
