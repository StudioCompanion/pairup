import { FormEvent } from 'react'
import { FormattedMessage } from 'react-intl'

import { useTypedSelector } from 'hooks/useTypedSelector'
import { useAppDispatch } from 'hooks/useAppDispatch'

import { SIGNUP_STAGE } from 'store/slices/signup/constants'
import { signupActions } from 'store/slices/signup/slice'

import { AccountDetailsForm } from 'components/SignUpForms/AccountDetailsForm'
import { PersonalDetailsForm } from 'components/SignUpForms/PersonalDetailsForm'
import { AvailabilityForm } from 'components/SignUpForms/AvailabilityForm'
import { omit } from 'helpers/objects'

import { POST_API_SLUGS } from 'references/slugs'
import { API_METHODS, fetchApi } from 'data/api'

const SignUp = () => {
  const signupStage = useTypedSelector((state) => state.signup.stage)

  const signupData = useTypedSelector(
    ({ signup }) => ({
      ...signup.accountDetails,
      ...signup.personalDetails,
      ...signup.availability,
      stage: signup.stage,
    }),
    (left) => {
      return left.stage !== SIGNUP_STAGE.AVAILABILITY
    }
  )

  const dispatch = useAppDispatch()

  const handleStartClick = () => {
    dispatch(
      signupActions.setSignupStage({ newStage: SIGNUP_STAGE.ACCOUNT_DETAILS })
    )
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = omit(signupData, 'stage')

    await fetchApi(API_METHODS.POST, POST_API_SLUGS.ACCOUNTS_SIGN_UP, formData)
  }

  // START
  if (signupStage === SIGNUP_STAGE.START) {
    return (
      <button onClick={handleStartClick}>
        <FormattedMessage id="signup-cta" />
      </button>
    )
  } else {
    // We're in form land.
    return (
      <form method="post" onSubmit={handleFormSubmit}>
        <AccountDetailsForm
          visible={signupStage === SIGNUP_STAGE.ACCOUNT_DETAILS}
        />
        <PersonalDetailsForm
          visible={signupStage === SIGNUP_STAGE.PERSONAL_DETAILS}
        />
        <AvailabilityForm visible={signupStage === SIGNUP_STAGE.AVAILABILITY} />
      </form>
    )
  }
}

export default SignUp
