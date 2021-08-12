import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

import { useTypedSelector } from 'hooks/useTypedSelector'
import { useAppDispatch } from 'hooks/useAppDispatch'

import { SIGNUP_STAGE } from 'store/slices/signup/constants'
import { signupActions } from 'store/slices/signup/slice'

import { AccountDetailsForm } from 'components/SignUpForms/AccountDetailsForm'

const SignUp = () => {
  const signupStage = useTypedSelector((state) => state.signup.stage)

  const dispatch = useAppDispatch()

  const handleStartClick = () => {
    dispatch(
      signupActions.setSignupStage({ newStage: SIGNUP_STAGE.ACCOUNT_DETAILS })
    )
  }

  // START
  if (signupStage === SIGNUP_STAGE.START) {
    return (
      <button onClick={handleStartClick}>
        <FormattedMessage id="signup-cta" />
      </button>
    )
  }
  // ACCOUNT DETAILS
  if (signupStage === SIGNUP_STAGE.ACCOUNT_DETAILS) {
    return <AccountDetailsForm />
  }

  // PERSONAL DETAILS

  // AVAILABILITY

  return null
}

export default SignUp
