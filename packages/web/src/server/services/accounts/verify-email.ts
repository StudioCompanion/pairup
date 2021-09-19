import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'

import prisma from 'db/prisma'

import { SLUG_VERIFICATION } from 'references/slugs'

export const verifyEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { code } = req.query

    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code as string,
      },
    })

    if (user) {
      const now = moment()
      const timeout = moment(user.verificationTimeout)

      if (now.isBefore(timeout)) {
        await prisma.user.update({
          where: {
            userId: user.userId,
          },
          data: {
            verificationCode: '',
            verified: true,
          },
        })

        res.redirect(200, `${SLUG_VERIFICATION}?success=true`)
      } else {
        res.redirect(
          401,
          `${SLUG_VERIFICATION}?fail=${encodeURIComponent('timeout')}`
        )
      }
    } else {
      res.redirect(
        401,
        `${SLUG_VERIFICATION}?fail=${encodeURIComponent('no user found')}`
      )
    }
  } catch (e: unknown) {
    console.error(e)
    res.status(500).json({
      errror: (e as Error).message,
    })
  }
}
