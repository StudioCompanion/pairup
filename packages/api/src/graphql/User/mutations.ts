import { extendType, nonNull, stringArg } from 'nexus'

import { signup } from '../../services/accounts/sign-up'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('userCreateAccount', {
      type: 'UserMutationReturn',
      description: 'Create an account for a new user',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        profile: nonNull('UserProfileInput'),
      },
      resolve: signup,
    })
  },
})
