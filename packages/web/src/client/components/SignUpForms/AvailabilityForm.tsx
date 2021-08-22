import { ChangeEvent, FormEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { DAYS_OF_THE_WEEK, TIMEZONES } from '@pairup/shared'

import { SIGNUP_AVAILABILITY_FIELD_NAMES } from 'store/slices/signup/constants'
import { signupActions } from 'store/slices/signup/slice'

import { useAppDispatch } from 'hooks/useAppDispatch'
import { useTypedSelector } from 'hooks/useTypedSelector'

type AvailabilityProps = {
  visible: boolean
}

export const AvailabilityForm = ({ visible }: AvailabilityProps) => {
  const dispatch = useAppDispatch()

  const { timezone, availabilityTimes } = useTypedSelector(
    (state) => state.signup.availability
  )

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.currentTarget

    dispatch(
      signupActions.setAvailability({
        fieldName: name as SIGNUP_AVAILABILITY_FIELD_NAMES,
        [name]: value,
      })
    )
  }

  const handleTimeChange =
    (day: DAYS_OF_THE_WEEK) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget
      dispatch(
        signupActions.setAvailability({
          fieldName: name as SIGNUP_AVAILABILITY_FIELD_NAMES,
          [name]: value,
          day,
        })
      )
    }

  return (
    <section style={{ display: visible ? 'block' : 'none' }}>
      <h2>
        <FormattedMessage id="signup-availability-title" />
      </h2>
      <label>
        <FormattedMessage id="signup-availability-timezone" />
        <select
          name={SIGNUP_AVAILABILITY_FIELD_NAMES.timezone}
          value={timezone}
          onChange={handleSelectChange}
          disabled={!visible}
        >
          {Object.values(TIMEZONES).map((zone) => (
            <option value={zone} key={zone}>
              {zone}
            </option>
          ))}
        </select>
      </label>
      <fieldset disabled={!visible}>
        <legend>
          <FormattedMessage id="signup-availability-availability" />
        </legend>
        <ul>
          {Object.values(DAYS_OF_THE_WEEK).map((day) => (
            <li key={day}>
              <h3>
                <FormattedMessage id={`signup-availability-${day}`} />
              </h3>
              <ul>
                <li>
                  <ul>
                    <li>
                      <label>
                        {`${day} `}
                        <FormattedMessage id="signup-availability-timestart" />
                        <input
                          type="time"
                          name={SIGNUP_AVAILABILITY_FIELD_NAMES.startTime}
                          value={availabilityTimes[day][0].startTime}
                          onChange={handleTimeChange(day)}
                        />
                      </label>
                    </li>
                    <li>
                      <label>
                        {`${day} `}
                        <FormattedMessage id="signup-availability-timeend" />
                        <input
                          type="time"
                          name={SIGNUP_AVAILABILITY_FIELD_NAMES.endTime}
                          value={availabilityTimes[day][0].endTime}
                          onChange={handleTimeChange(day)}
                        />
                      </label>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </fieldset>
      <div>
        <button type="submit" disabled={!visible}>
          <FormattedMessage id="signup-availability-submit" />
        </button>
      </div>
    </section>
  )
}
