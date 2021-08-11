import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const initialState = {
  accountDetails: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
}

export enum ACCOUNT_DETAIL_FIELD_NAMES {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  password = 'password',
}

const signupReducer = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setAccountDetails: (
      state,
      action: PayloadAction<{
        fieldName: ACCOUNT_DETAIL_FIELD_NAMES
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
