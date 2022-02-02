import { enumType } from 'nexus'

export const ErrorCodesType = enumType({
  name: 'ErrorCodes',
  description: 'Possible error codes that can be returned',
  members: {
    INVALID: 'Invalid',
    NOT_FOUND: 'NotFound',
  },
})
