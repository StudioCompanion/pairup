import { enumType } from 'nexus'

export const ErrorCodesType = enumType({
  name: 'ErrorCodes',
  description: 'Possible error codes that can be returned',
  members: [
    {
      value: 'Invalid',
      name: 'INVALID',
      description: 'An invalid value has been passed',
    },
    {
      value: 'NotFound',
      name: 'NOT_FOUND',
      description: 'The entry was not found',
    },
  ],
})
