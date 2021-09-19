import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'

import prisma from 'db/prisma'

import { SLUG_VERIFICATION } from 'references/slugs'
import createOrUpdateDocument from '../sanity/createOrUpdateDocument'

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

    if (user && !user.verified) {
      const now = moment()
      const timeout = moment(user.verificationTimeout)

      if (now.isBefore(timeout)) {
        const updatedUser = await prisma.user.update({
          where: {
            userId: user.userId,
          },
          data: {
            verificationCode: '',
            verified: true,
          },
        })

        if (updatedUser) {
          await createOrUpdateDocument({
            _type: 'pairerProfile',
            _id: updatedUser.userId,
            hasVerifiedAccount: true,
          })

          res.redirect(200, `${SLUG_VERIFICATION}?success=true`)
        } else {
          throw new Error()
        }
      } else {
        res.redirect(
          401,
          `${SLUG_VERIFICATION}?fail=${encodeURIComponent('timeout')}`
        )
      }
    } else {
      res.redirect(
        401,
        `${SLUG_VERIFICATION}?fail=${encodeURIComponent(
          !user ? 'no user found' : 'user is already verified'
        )}`
      )
    }
  } catch (e: unknown) {
    console.error(e)
    res.status(500).json({
      errror: (e as Error).message,
    })
  }
}
