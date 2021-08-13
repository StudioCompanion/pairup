import { ChangeEvent } from 'react'
import { DISCIPLINES } from '@pairup/shared/constants'

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

  const handleOnChange =
    (fieldName: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      /**
       * If it's a checkbox we're using an array
       * to manage it all so need to perform special
       * logic on this
       */
      if (fieldName === SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines) {
        const { value } = e.currentTarget
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
            fieldName,
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
    <fieldset
      disabled={!visible}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <legend>
        <FormattedMessage id="signup-personaldetails-title" />
      </legend>
      <label>
        <FormattedMessage id="signup-personaldetails-jobtitle" />
        <input
          type="text"
          value={jobTitle}
          onChange={handleOnChange(SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.jobTitle)}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-companyurl" />
        <input
          type="url"
          value={companyUrl}
          onChange={handleOnChange(
            SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.companyUrl
          )}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-portfoliourl" />
        <input
          type="url"
          value={portfolioUrl}
          onChange={handleOnChange(
            SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.portfolioUrl
          )}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-bio" />
        <input
          type="text"
          value={bio}
          onChange={handleOnChange(SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.bio)}
        />
      </label>
      <fieldset>
        <legend>
          <FormattedMessage id="signup-personaldetails-disciplines" />
        </legend>
        {Object.values(DISCIPLINES).map((x) => (
          <label key={x}>
            <input
              type="checkbox"
              value={x}
              checked={disciplines.includes(x)}
              onChange={handleOnChange(
                SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines
              )}
            />
            {x}
          </label>
        ))}
      </fieldset>
      <label>
        <FormattedMessage id="signup-personaldetails-twitter" />
        <input
          type="url"
          value={twitter}
          onChange={handleOnChange(SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.twitter)}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-instagram" />
        <input
          type="url"
          value={instagram}
          onChange={handleOnChange(
            SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.instagram
          )}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-linkedin" />
        <input
          type="url"
          value={linkedin}
          onChange={handleOnChange(SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.linkedin)}
        />
      </label>
      <label>
        <FormattedMessage id="signup-personaldetails-github" />
        <input
          type="url"
          value={github}
          onChange={handleOnChange(SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.github)}
        />
      </label>
      <button type="button" onClick={handleContinueClick}>
        <FormattedMessage id="signup-personaldetails-continue" />
      </button>
    </fieldset>
  )
}
