import { extendType, nonNull, stringArg } from 'nexus'
import { createAccessToken } from '../../services/tokens/createAccessToken'

import { signup } from '../../services/accounts/sign-up'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('userCreateAccount', {
      type: 'UserCreateAccountMutationReturn',
      description: 'Create an account for a new user',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        profile: nonNull('UserProfileInput'),
      },
      resolve: signup,
    })

    t.nullable.field('userCreateAccessToken', {
      type: 'UserCreateTokenMutationReturn',
      description: 'Create an access token for the current user',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: createAccessToken,
    })
  },
})
