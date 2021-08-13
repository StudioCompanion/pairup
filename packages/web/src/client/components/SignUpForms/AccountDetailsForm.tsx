import { ChangeEvent } from 'react'

import {
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_STAGE,
} from 'store/slices/signup/constants'
import { signupActions } from 'store/slices/signup/slice'

import { useTypedSelector } from 'hooks/useTypedSelector'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { FormattedMessage } from 'react-intl'

type AccountDetailsProps = {
  visible: boolean
}

const AccountDetailsForm = ({ visible }: AccountDetailsProps) => {
  const { firstName, lastName, password, email } = useTypedSelector(
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

  return (
    <fieldset
      disabled={!visible}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <legend>
        <FormattedMessage id="signup-accountdetails-title" />
      </legend>
      <label>
        <FormattedMessage id="signup-accountdetails-firstname" />
        <input
          type="text"
          value={firstName}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.firstName)}
        />
      </label>
      <label>
        <FormattedMessage id="signup-accountdetails-lastname" />
        <input
          type="text"
          value={lastName}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.lastName)}
        />
      </label>
      <label>
        <FormattedMessage id="signup-accountdetails-email" />
        <input
          type="email"
          value={email}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.email)}
        />
      </label>
      <label>
        <FormattedMessage id="signup-accountdetails-password" />
        <input
          type="password"
          value={password}
          onChange={handleOnChange(SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.password)}
        />
      </label>
      <button type="button" onClick={handleContinueClick}>
        <FormattedMessage id="signup-accountdetails-continue" />
      </button>
    </fieldset>
  )
}

export { AccountDetailsForm }
