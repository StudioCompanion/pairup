import { FieldResolver } from 'nexus'
import { add } from 'date-fns'
import { JsonWebTokenError } from 'jsonwebtoken'

import { verifyUserToken, createToken } from '../../helpers/tokens'
import { NoUserError } from '../../helpers/errors'

export const refreshAccessToken: FieldResolver<
  'Mutation',
  'userRefreshAccessToken'
> = async (_, args) => {
  try {
    const user = await verifyUserToken(args.accessToken, {
      ignoreExpiration: true,
    })

    const newToken = createToken(
      {
        userId: user.userId,
      },
      user.personalKey,
      {
        expiresIn: '7d',
      }
    )

    const expiresAt = add(Date.now(), {
      days: 7,
    })

    return {
      UserAccessToken: {
        accessToken: newToken,
        expiresAt,
      },
      UserError: [],
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      throw err
    }

    if (err instanceof NoUserError) {
      return {
        User: null,
        UserAccessToken: null,
        UserError: [
          {
            errorCode: 'NotFound',
            input: 'accessToken',
            message: 'No user found using the token provided',
          },
        ],
      }
    }

    return {
      UserAccessToken: null,
      UserError: [],
    }
  }
}
