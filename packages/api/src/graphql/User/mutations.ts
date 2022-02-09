import { extendType, nonNull, stringArg } from 'nexus'
import { createAccessToken } from '../../services/tokens/createAccessToken'

import { signup } from '../../services/accounts/signup'
import { updateAccount } from '../../services/accounts/updateAccount'
import { recoverAccount } from '../../services/accounts/recoverAccount'
import { resetAccount } from '../../services/accounts/resetAccount'
import { refreshAccessToken } from '../../services/tokens/refreshAccessToken'

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

    t.nullable.field('userRecover', {
      type: 'UserRecoverPayload',
      description:
        'Starts the recovery process for a user who has forgotten their password',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: recoverAccount,
    })

    t.nullable.field('userReset', {
      type: 'UserResetPayload',
      description: 'Reset a users password by providing a resetToken',
      args: {
        password: nonNull(stringArg()),
        resetToken: nonNull(stringArg()),
      },
      resolve: resetAccount,
    })

    t.nullable.field('userRefreshAccessToken', {
      type: 'UserRefreshAccessTokenPayload',
      description:
        'Refreshes tokens including expired ones assuming the personalKey has not changed',
      args: {
        accessToken: nonNull(stringArg()),
      },
      resolve: refreshAccessToken,
    })
  },
})
