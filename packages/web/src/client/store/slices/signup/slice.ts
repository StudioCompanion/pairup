import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import {
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_STAGE,
  SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
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

export type SignUpInitialState = {
  stage: SIGNUP_STAGE
  accountDetails: SignUpAccountDetails
  personalDetails: SignUpPersonalDetails
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
  },
})

export const signupActions = signupReducer.actions

export default signupReducer.reducer
