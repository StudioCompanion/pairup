import { ChangeEvent } from 'react'
import { DISCIPLINES } from '@pairup/shared'

import { useTypedSelector } from 'hooks/useTypedSelector'
import { useAppDispatch } from 'hooks/useAppDispatch'

import {
  SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
  SIGNUP_STAGE,
} from 'store/slices/signup/constants'
import { signupActions } from 'store/slices/signup/slice'
import { FormattedMessage } from 'react-intl'

type PersonalDetailsProps = {
  visible: boolean
}

export const PersonalDetailsForm = ({ visible }: PersonalDetailsProps) => {
  const {
    jobTitle,
    companyUrl,
    portfolioUrl,
    bio,
    disciplines,
    twitter,
    instagram,
    linkedin,
    github,
  } = useTypedSelector((state) => state.signup.personalDetails)

  const dispatch = useAppDispatch()

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.currentTarget
    /**
     * If it's a checkbox we're using an array
     * to manage it all so need to perform special
     * logic on this
     */
    if (fieldName === SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines) {
      // If the value exists, remove it
      if (disciplines.includes(value)) {
        dispatch(
          signupActions.setPersonalDetails({
            fieldName,
            [fieldName]: disciplines.filter((x) => x !== value),
          })
        )
      } else {
        // If it doesn't exist, add it
        dispatch(
          signupActions.setPersonalDetails({
            fieldName,
            [fieldName]: [...disciplines, value],
          })
        )
      }
    } else {
      dispatch(
        signupActions.setPersonalDetails({
          fieldName: fieldName as SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
          [fieldName]: e.currentTarget.value,
        })
      )
    }
  }

  const handleContinueClick = () => {
    dispatch(
      signupActions.setSignupStage({
        newStage: SIGNUP_STAGE.AVAILABILITY,
      })
    )
  }

  return (
    <section style={{ display: visible ? 'block' : 'none' }}>
      <h2>
        <FormattedMessage id="signup-personaldetails-title" />
      </h2>
      <label>
        <FormattedMessage id="signup-personaldetails-jobtitle" />
        <input
          type="text"
          value={jobTitle}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.jobTitle}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-companyurl" />
        <input
          type="url"
          value={companyUrl}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.companyUrl}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-portfoliourl" />
        <input
          type="url"
          value={portfolioUrl}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.portfolioUrl}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-bio" />
        <input
          type="text"
          value={bio}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.bio}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <fieldset disabled={!visible}>
        <legend>
          <FormattedMessage id="signup-personaldetails-disciplines" />
        </legend>
        <ul>
          {Object.values(DISCIPLINES).map((discipline) => (
            <li key={discipline}>
              <label>
                <input
                  type="checkbox"
                  value={discipline}
                  checked={disciplines.includes(discipline)}
                  name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines}
                  onChange={handleOnChange}
                />
                {discipline}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <label>
        <FormattedMessage id="signup-personaldetails-twitter" />
        <input
          type="url"
          value={twitter}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.twitter}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-instagram" />
        <input
          type="url"
          value={instagram}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.instagram}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-linkedin" />
        <input
          type="url"
          value={linkedin}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.linkedin}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-github" />
        <input
          type="url"
          value={github}
          name={SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.github}
          onChange={handleOnChange}
          disabled={!visible}
        />
      </label>
      <div>
        <button type="button" onClick={handleContinueClick} disabled={!visible}>
          <FormattedMessage id="signup-personaldetails-continue" />
        </button>
      </div>
    </section>
  )
}
