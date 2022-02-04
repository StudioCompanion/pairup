import { Request } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import { Logger } from '../../helpers/console'

export interface AuthenticatedUser {
  userId: string | null
}

export const verifyAuthToken = (req: Request): AuthenticatedUser => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      throw new Error('No JWT_SECRET – cannot verify any tokens')
    }

    const { authorization } = req.headers

    if (!authorization) {
      return { userId: null }
    }

    const token = authorization.replace('Bearer ', '')

    if (!token) {
      return { userId: null }
    }

    return jwt.verify(token, JWT_SECRET) as AuthenticatedUser
  } catch (err) {
    Logger.error(err)

    if (err instanceof JsonWebTokenError) {
      throw err
    }

    return { userId: null }
  }
}
