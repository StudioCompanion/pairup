import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import validator from 'validator'
import {
  DAYS_OF_THE_WEEK,
  DISCIPLINES,
  PAIRER_PROFILE_STATUS,
  TIMEZONES,
} from '@pairup/shared'
import { randomUUID, randomBytes, pbkdf2, randomInt, createHash } from 'crypto'

import prisma from 'db/prisma'
import { sendVerificationEmail } from 'services/emails/sendVerificationEmail'
import createOrUpdateDocument from 'services/sanity/createOrUpdateDocument'

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

import { PairerProfileCreationDocument } from 'types/sanity'

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

          const now = moment()

          /**
           * This will timeout in 1 day.
           */
          const verificationCode = createHash('md5')
            .update(randomInt(1000).toFixed(0))
            .digest('hex')

          // create our user
          const createdUser = await prisma.user.create({
            data: {
              email,
              salt: salt.toString(),
              hashedPassword: hashedPassword.toString(),
              userId,
              verificationCode,
              verificationTimeout: now.add(1, 'days').format(),
            },
          })

          const availableTimes = Object.entries(availabilityTimes)
            .map(([key, value]) => [
              key,
              value.map((obj) => ({ ...obj, _key: randomUUID() })),
            ])
            .reduce(
              (acc, [key, value]) => {
                return {
                  ...acc,
                  [key as DAYS_OF_THE_WEEK]: value,
                }
              },
              {} as {
                [P in DAYS_OF_THE_WEEK]: Array<{
                  _key: string
                  startTime: string
                  endTime: string
                  _type: 'availableTime'
                }>
              }
            )

          const pairerDocument: PairerProfileCreationDocument = {
            _type: 'pairerProfile',
            _id: userId,
            title: `${firstName} ${lastName}`,
            createdAt: now.format(),
            lastModifiedAt: now.format(),
            status: PAIRER_PROFILE_STATUS.AWAITING_APPROVAL,
            hasVerifiedAccount: false,
            firstName,
            lastName,
            email,
            uuid: userId,
            jobTitle,
            companyUrl,
            portfolioUrl,
            bio,
            disciplines: disciplines.join(','),
            twitter,
            instagram,
            linkedin,
            github,
            timezone,
            ...availableTimes,
          }

          await createOrUpdateDocument(pairerDocument)

          /**
           * Send the verification email
           */
          await sendVerificationEmail(email, verificationCode, {
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
    res.status(406).json({
      errror: (e as Error).message,
    })
  }
}
