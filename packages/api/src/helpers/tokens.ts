import { captureException, Scope } from '@sentry/node'
import jwt, { JsonWebTokenError, VerifyOptions } from 'jsonwebtoken'

import { prisma } from '../db/prisma'

import { AuthenticatedUser } from '../services/tokens/verifyAuthToken'

import { Logger } from './console'
import { NoUserError } from './errors'

export interface RefreshOptions {
  verifyOptions?: jwt.VerifyOptions
  signOptions?: jwt.SignOptions
}

const JWT_SECRET = process.env.JWT_SECRET

interface ResetPayload {
  resetUserId: string
}

export const verifyUserToken = async (
  token: string,
  verifyOptions?: VerifyOptions
) => {
  if (!JWT_SECRET) {
    throw new Error('No JWT_SECRET set – cannot verify tokens')
  }

  /**
   * Decode, don't check the verification yet
   */
  const payload = jwt.decode(token) as AuthenticatedUser | ResetPayload

  if (!payload) {
    throw new JsonWebTokenError('jwt malformed')
  }

  const id =
    (payload as AuthenticatedUser).userId ||
    (payload as ResetPayload).resetUserId

  if (id) {
    /**
     * Use the userId to find our user
     */
    const user = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    })

    if (!user) {
      throw new NoUserError('No user found from token')
    }

    /**
     * Get the user's personal key
     */
    const { personalKey } = user

    /**
     * Now we actually verify
     */
    jwt.verify(token, `${JWT_SECRET}${personalKey}`, {
      ...verifyOptions,
    }) as AuthenticatedUser

    return user
  } else {
    throw new Error('No payload in token found')
  }
}

export const createToken = (
  payload: jwt.JwtPayload | string,
  personalKey: string,
  signOptions?: jwt.SignOptions
): string => {
  try {
    if (!JWT_SECRET) {
      throw new Error('No JWT_SECRET set – cannot create tokens')
    }

    return jwt.sign(payload, `${JWT_SECRET}${personalKey}`, signOptions)
  } catch (err) {
    const errMsg = 'Failed to create User Token'
    Logger.error(errMsg, err)
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
      })
    )

    return ''
  }
}
