import { ChangeEvent } from 'react'

import {
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_STAGE,
} from 'store/slices/signup/constants'
import { signupActions } from 'store/slices/signup/slice'

import { useTypedSelector } from 'hooks/useTypedSelector'
import { useAppDispatch } from 'hooks/useAppDispatch'

type AccountDetailsProps = {
  visible: boolean
}

const AccountDetailsForm = ({ visible }: AccountDetailsProps) => {
  const accountDetails = useTypedSelector(
    (state) => state.signup.accountDetails
  )

  const dispatch = useAppDispatch()

  const handleOnChange =
    (fieldName: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        signupActions.setAccountDetails({
          fieldName,
          [fieldName]: e.currentTarget.value,
        })
      )
    }

  const handleContinueClick = () => {
    dispatch(
      signupActions.setSignupStage({
        newStage: SIGNUP_STAGE.PERSONAL_DETAILS,
      })
    )
  }

  const { firstName, lastName, password, email } = accountDetails

  return (
    <fieldset
      disabled={!visible}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <legend>account details</legend>
      <label>
        First Name
        <input
          type="text"
          value={firstName}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.firstName)}
        />
      </label>
      <label>
        Last Name
        <input
          type="text"
          value={lastName}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.lastName)}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.email)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.password)}
        />
      </label>
      <button type="button" onClick={handleContinueClick}>
        Continue to Personal Details
      </button>
    </fieldset>
  )
}

export { AccountDetailsForm }
