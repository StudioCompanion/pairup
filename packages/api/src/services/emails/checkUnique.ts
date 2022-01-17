import { NextApiRequest, NextApiResponse } from 'next'
import isEmail from 'validator/lib/isEmail'

import prisma from 'server/db/prisma'

export type AccountsEmailApiResponse = {
  error?: string
}

export const checkIfEmailExists = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { email } = req.body

    if (!email) {
      throw new Error('Email address must be provided')
    }

    if (isEmail(email)) {
      const users = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!users) {
        res.status(200).end()
      } else {
        throw new Error('User with email address already exists')
      }
    } else {
      throw new Error('Email is not a valid email address')
    }
  } catch (e) {
    res.status(422).json({
      error: (e as Error).message,
    })
  }
}
