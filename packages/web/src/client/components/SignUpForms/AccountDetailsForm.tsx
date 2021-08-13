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

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.currentTarget.name as SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES
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
    <section style={{ display: visible ? 'block' : 'none' }}>
      <h2>
        <FormattedMessage id="signup-accountdetails-title" />
      </h2>
      <label>
        <FormattedMessage id="signup-accountdetails-firstname" />
        <input
          type="text"
          value={firstName}
          name={SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.firstName}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-accountdetails-lastname" />
        <input
          type="text"
          value={lastName}
          name={SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.lastName}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-accountdetails-email" />
        <input
          type="email"
          value={email}
          name={SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.email}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-accountdetails-password" />
        <input
          type="password"
          value={password}
          name={SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.password}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <div>
        <button type="button" onClick={handleContinueClick} disabled={!visible}>
          <FormattedMessage id="signup-accountdetails-continue" />
        </button>
      </div>
    </section>
  )
}

export { AccountDetailsForm }
