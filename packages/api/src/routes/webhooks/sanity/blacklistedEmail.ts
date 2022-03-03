import { captureException, Scope } from '@sentry/node'
import { RequestHandler } from 'express'

import { GraphQLResolveInfo } from 'graphql'
import { prisma } from '../../../db/prisma'

import { deleteAccount } from '../../../services/accounts/deleteAccount'

interface BlacklistedEmailRequestBody {
  _id?: string
  email?: string
}

type BlacklistedEmailResponse = string

export const blacklistedEmail: RequestHandler<
  null,
  BlacklistedEmailResponse,
  BlacklistedEmailRequestBody
> = async (req, res) => {
  try {
    const { email } = req.body
    const prismaUser = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (prismaUser) {
      await deleteAccount(
        {},
        {},
        {
          prisma,
          user: {
            userId: prismaUser.userId,
          },
        },
        null as unknown as GraphQLResolveInfo
      )
      res.status(200).end()
    } else {
      throw new Error('Failed to retrieve prismaUser')
    }
  } catch (err) {
    const msg = 'Failed to delete user account'

    console.error(msg, err)
    captureException(
      msg,
      new Scope().setExtras({
        err,
        data: req.body,
      })
    )
  }
}
