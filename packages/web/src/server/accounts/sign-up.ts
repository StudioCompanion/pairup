import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import { DISCIPLINES, TIMEZONES } from '@pairup/shared'
import { randomUUID, randomBytes, pbkdf2 } from 'crypto'

import prisma from 'server/db/prisma'

import {
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_AVAILABILITY_FIELD_NAMES,
  SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
} from 'store/slices/signup/constants'
import {
  SignUpAccountDetails,
  SignUpPersonalDetails,
  SignUpAvailability,
  AvailabilityTimes,
} from 'store/slices/signup/slice'

import { omit } from 'helpers/objects'

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

export type CreatedUser = Pick<
  SignUpAccountDetails,
  'firstName' | 'lastName' | 'email'
> &
  SignUpPersonalDetails &
  SignUpAvailability & {
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

export const signup = (
  req: NextApiRequest & {
    login: (user: CreatedUser, done: (err: unknown) => void) => void
  },
  res: NextApiResponse
) => {
  try {
    const validation = Object.entries(req.body).map(([key, value]) =>
      validateBodyKey(
        key as AllSignUpFieldNames,
        value as AllSignUpValues[keyof AllSignUpValues]
      )
    )

    if (validation.includes(false)) {
      throw new Error('Data is not expected form')
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
      const salt = randomBytes(16)
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

          const userId = randomUUID()

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

          const user: CreatedUser = {
            userId: createdUser.userId,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            timezone: createdUser.pairerDetails?.availability
              .timezone as TIMEZONES,
            availabilityTimes: createdUser.pairerDetails
              ?.availability as unknown as AvailabilityTimes,
            ...omit(
              createdUser.pairerDetails!,
              'availability',
              'userId',
              'disciplines'
            ),
            disciplines: createdUser.pairerDetails
              ?.disciplines as DISCIPLINES[],
          }

          req.login(user, function (err) {
            if (err) {
              throw err
            }
            res.redirect('/')
          })
        }
      )
    }
  } catch (e) {
    res.status(500).json({
      errror: e.message,
    })
  }
}
