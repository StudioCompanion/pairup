import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES, SIGNUP_STAGE } from './constants'

export const initialState = {
  stage: SIGNUP_STAGE.START,
  accountDetails: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
      action: PayloadAction<{
        fieldName: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES
        firstName?: string
        lastName?: string
        email?: string
        password?: string
      }>
    ) => {
      const { payload } = action

      state.accountDetails[payload.fieldName] = payload[payload.fieldName] || ''
    },
  },
})

export const signupActions = signupReducer.actions

export default signupReducer.reducer
