import { Request } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import { Logger } from '../../helpers/console'

import { prisma } from '../../db/prisma'

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

    const payload = jwt.decode(token) as AuthenticatedUser

    if (payload.userId) {
      const user = await prisma.user.findUnique({
        where: {
          userId: payload.userId,
        },
      })

      if (!user) {
        throw new Error('No user found from token')
      }

      const { personalKey } = user

      return jwt.verify(
        token,
        `${JWT_SECRET}${personalKey}`
      ) as AuthenticatedUser
    } else {
      throw new Error('No payload in token found')
    }
  } catch (err) {
    Logger.error(err)

    if (err instanceof JsonWebTokenError) {
      throw err
    }

    return { userId: null }
  }
}
