import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import { DISCIPLINES, TIMEZONES } from '@pairup/shared'
import { randomUUID, randomBytes, pbkdf2 } from 'crypto'

import prisma from 'server/db/prisma'
import { sendVerificationEmail } from 'server/emails/sendVerificationEmail'

import {
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_AVAILABILITY_FIELD_NAMES,
  SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
} from 'store/slices/signup/constants'
import {
  SignUpAccountDetails,
  SignUpPersonalDetails,
  SignUpAvailability,
} from 'store/slices/signup/slice'

import { SLUG_ACCOUNT } from 'references/slugs'

type UserBody = SignUpAccountDetails &
  SignUpPersonalDetails &
  SignUpAvailability

type AllSignUpFieldNames =
  | SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES
  | SIGNUP_PERSONAL_DETAIL_FIELD_NAMES
  | SIGNUP_AVAILABILITY_FIELD_NAMES

type AllSignUpValues = SignUpAccountDetails &
  SignUpPersonalDetails &
  SignUpAvailability

export type CreatedUser = Pick<SignUpAccountDetails, 'email'> & {
  userId: string
}

const disciplines = Object.values(DISCIPLINES)
const timezones = Object.values(TIMEZONES)

const validateBodyKey = <T extends AllSignUpValues[keyof AllSignUpValues]>(
  key: AllSignUpFieldNames,
  value: T
) => {
  switch (key) {
    case SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.email:
      return validator.isEmail(value as AllSignUpValues['email'])
    case SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.companyUrl:
      return validator.isURL(value as AllSignUpValues['companyUrl'])
    case SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.portfolioUrl:
      return validator.isURL(value as AllSignUpValues['portfolioUrl'])
    case SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines:
      return !(value as AllSignUpValues['disciplines'])
        .map((item) => disciplines.includes(item))
        .includes(false)
    case SIGNUP_AVAILABILITY_FIELD_NAMES.timezone:
      return timezones.includes(value as AllSignUpValues['timezone'])
    default:
      return true
  }
}

export const signup = async (
  req: NextApiRequest & {
    login: (user: CreatedUser, done: (err: unknown) => void) => void
  },
  res: NextApiResponse
) => {
  try {
    /**
     * Validate our fields Server Side
     */
    const validation = Object.entries(req.body).map(([key, value]) =>
      validateBodyKey(
        key as AllSignUpFieldNames,
        value as AllSignUpValues[keyof AllSignUpValues]
      )
    )

    /**
     * Check the DB for a user that has the email
     * If they do, throw because it'll crash the application
     */
    const users = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    })

    if (validation.includes(false)) {
      throw new Error('Data is not expected form')
    } else if (users) {
      throw new Error('Email address already exists with a user')
    } else {
      const {
        firstName,
        lastName,
        email,
        password,
        jobTitle,
        companyUrl,
        portfolioUrl,
        bio,
        disciplines,
        twitter,
        instagram,
        linkedin,
        github,
        timezone,
        availabilityTimes,
      } = req.body as UserBody
      // Salt
      const salt = randomBytes(16)
      // Create password
      pbkdf2(
        password,
        salt,
        10000,
        32,
        'sha256',
        async (err, hashedPassword) => {
          if (err) {
            throw err
          }

          // create the uuid we'll use across the app
          const userId = randomUUID()

          // create our user
          const createdUser = await prisma.user.create({
            data: {
              firstName,
              lastName,
              email,
              salt: salt.toString(),
              hashedPassword: hashedPassword.toString(),
              userId,
              pairerDetails: {
                create: {
                  jobTitle,
                  companyUrl,
                  portfolioUrl,
                  bio,
                  disciplines,
                  twitter,
                  instagram,
                  linkedin,
                  github,
                  availability: {
                    create: {
                      timezone,
                      userId,
                      ...availabilityTimes,
                    },
                  },
                },
              },
            },
            include: {
              pairerDetails: {
                include: {
                  availability: true,
                },
              },
            },
          })

          /**
           * Send the verification email
           */
          await sendVerificationEmail(email, {
            firstName,
          })

          /**
           * return the CreateUser to the req.login
           * function injected by passport
           */
          const user: CreatedUser = {
            userId: createdUser.userId,
            email: createdUser.email,
          }

          req.login(user, function (err) {
            if (err) {
              throw err
            }
            res.redirect(SLUG_ACCOUNT)
          })
        }
      )
    }
  } catch (e: unknown) {
    console.error(e)
    res.status(500).json({
      errror: (e as Error).message,
    })
  }
}
