import { ChangeEvent, FormEvent } from 'react'

import { SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES } from 'store/slices/signup/constants'
import { signupActions } from 'store/slices/signup/slice'

import { useTypedSelector } from 'hooks/useTypedSelector'
import { useAppDispatch } from 'hooks/useAppDispatch'

const AccountDetailsForm = () => {
  const accountDetails = useTypedSelector(
    (state) => state.signup.accountDetails
  )

  const dispatch = useAppDispatch()

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log(accountDetails)
  }

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

  const { firstName, lastName, password, email } = accountDetails

  return (
    <form onSubmit={handleFormSubmit}>
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
      <button type="submit">Continue to Personal Details</button>
    </form>
  )
}

export { AccountDetailsForm }
