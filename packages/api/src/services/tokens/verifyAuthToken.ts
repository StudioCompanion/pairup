import { Request } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'

import { Logger } from '../../helpers/console'

import { verifyUserToken } from '../../helpers/tokens'

export interface AuthenticatedUser {
  userId: string | null
}

export const verifyAuthToken = async (
  req: Request
): Promise<AuthenticatedUser> => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      throw new Error('No JWT_SECRET – cannot verify any tokens')
    }

    const { authorization } = req.headers

    if (!authorization) {
      throw new Error('No Authorization header found')
    }

    const token = authorization.replace('Bearer ', '')

    if (!token) {
      throw new Error('No token found')
    }

    const user = await verifyUserToken(token)

    return { userId: user.userId }
  } catch (err) {
    Logger.error(err)

    if (err instanceof JsonWebTokenError) {
      throw err
    }

    return { userId: null }
  }
}
