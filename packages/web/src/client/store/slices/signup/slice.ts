import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DAYS_OF_THE_WEEK, TIMEZONES } from '@pairup/shared'

import {
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_STAGE,
  SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
  SIGNUP_AVAILABILITY_FIELD_NAMES,
} from './constants'

export type SignUpAccountDetails = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type SignUpPersonalDetails = {
  jobTitle: string
  companyUrl: string
  portfolioUrl: string
  bio: string
  disciplines: string[]
  twitter: string
  instagram: string
  linkedin: string
  github: string
}

type AvailableTime = {
  startTime: string
  endTime: string
}

const BASE_AVAILABLE_TIME: AvailableTime = {
  startTime: '00:00',
  endTime: '00:00',
}

type AvailabilityTimes = {
  [DAYS_OF_THE_WEEK.MONDAY]: AvailableTime[]
  [DAYS_OF_THE_WEEK.TUESDAY]: AvailableTime[]
  [DAYS_OF_THE_WEEK.WEDNESDAY]: AvailableTime[]
  [DAYS_OF_THE_WEEK.THURSDAY]: AvailableTime[]
  [DAYS_OF_THE_WEEK.FRIDAY]: AvailableTime[]
  [DAYS_OF_THE_WEEK.SATURDAY]: AvailableTime[]
  [DAYS_OF_THE_WEEK.SUNDAY]: AvailableTime[]
}

export type SignUpAvailability = {
  timezone: TIMEZONES
  availabilityTimes: AvailabilityTimes
}

export type SignUpInitialState = {
  stage: SIGNUP_STAGE
  accountDetails: SignUpAccountDetails
  personalDetails: SignUpPersonalDetails
  availability: SignUpAvailability
}

export const initialState: SignUpInitialState = {
  stage: SIGNUP_STAGE.START,
  accountDetails: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  personalDetails: {
    jobTitle: '',
    companyUrl: '',
    portfolioUrl: '',
    bio: '',
    disciplines: [],
    twitter: '',
    instagram: '',
    linkedin: '',
    github: '',
  },
  availability: {
    timezone: TIMEZONES.GMT,
    availabilityTimes: {
      [DAYS_OF_THE_WEEK.MONDAY]: [BASE_AVAILABLE_TIME],
      [DAYS_OF_THE_WEEK.TUESDAY]: [BASE_AVAILABLE_TIME],
      [DAYS_OF_THE_WEEK.WEDNESDAY]: [BASE_AVAILABLE_TIME],
      [DAYS_OF_THE_WEEK.THURSDAY]: [BASE_AVAILABLE_TIME],
      [DAYS_OF_THE_WEEK.FRIDAY]: [BASE_AVAILABLE_TIME],
      [DAYS_OF_THE_WEEK.SATURDAY]: [BASE_AVAILABLE_TIME],
      [DAYS_OF_THE_WEEK.SUNDAY]: [BASE_AVAILABLE_TIME],
    },
  },
}

const signupReducer = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setSignupStage: (
      state,
      action: PayloadAction<{
        newStage: SIGNUP_STAGE
      }>
    ) => {
      state.stage = action.payload.newStage
    },
    setAccountDetails: (
      state,
      action: PayloadAction<
        Partial<SignUpAccountDetails> & {
          fieldName: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES
        }
      >
    ) => {
      const { payload } = action

      state.accountDetails[payload.fieldName] = payload[payload.fieldName] || ''
    },
    setPersonalDetails: (
      state,
      action: PayloadAction<
        Partial<SignUpPersonalDetails> & {
          fieldName: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES
        }
      >
    ) => {
      const { payload } = action

      if (
        payload.fieldName === SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines
      ) {
        state.personalDetails[payload.fieldName] =
          payload[payload.fieldName] || []
      } else {
        state.personalDetails[payload.fieldName] =
          payload[payload.fieldName] || ''
      }
    },
    setAvailability: (
      state,
      action: PayloadAction<
        Partial<Pick<SignUpAvailability, 'timezone'>> &
          Partial<AvailableTime> & {
            day?: DAYS_OF_THE_WEEK
            fieldName: SIGNUP_AVAILABILITY_FIELD_NAMES
          }
      >
    ) => {
      const { payload } = action
      const { fieldName, day } = payload

      if (
        (fieldName === SIGNUP_AVAILABILITY_FIELD_NAMES.startTime ||
          fieldName === SIGNUP_AVAILABILITY_FIELD_NAMES.endTime) &&
        day
      ) {
        const [time] = state.availability.availabilityTimes[day]
        state.availability.availabilityTimes[day] = [
          {
            ...time,
            [fieldName]: payload[fieldName],
          },
        ]
      } else if (fieldName === SIGNUP_AVAILABILITY_FIELD_NAMES.timezone) {
        state.availability[fieldName] = payload[fieldName] || TIMEZONES.GMT
      }
    },
  },
})

export const signupActions = signupReducer.actions

export default signupReducer.reducer
