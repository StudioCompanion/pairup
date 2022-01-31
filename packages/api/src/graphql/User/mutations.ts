import { extendType, nonNull, stringArg } from 'nexus'
import { createAccessToken } from '../../services/tokens/createAccessToken'

import { signup } from '../../services/accounts/sign-up'
import { updateAccount } from '../../services/accounts/updateAccount'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('userCreateAccount', {
      type: 'UserCreateAccountPayload',
      description: 'Create an account for a new user',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        profile: nonNull('UserProfileInput'),
      },
      resolve: signup,
    })

    t.nullable.field('userCreateAccessToken', {
      type: 'UserCreateTokenPayload',
      description: 'Create an access token for the current user',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: createAccessToken,
    })

    t.nullable.field('userUpdateAccount', {
      type: 'UserUpdateAccountPayload',
      description: 'Update an account for an existing user',
      args: {
        email: stringArg(),
        password: stringArg(),
        profile: 'UserProfileInput',
      },
      resolve: updateAccount,
    })
  },
})
