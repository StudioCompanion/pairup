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

export const ReportErrorCodesType = enumType({
  name: 'ReportErrorCodes',
  description: 'Possible error codes that can be returned from ReportError',
  members: {
    INVALID: 'Invalid',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    BAD_USER_INPUT: 'Bad user input',
    GRAPHQL_VALIDATION_FAILED: 'GraphQL validation failed',
  },
})
