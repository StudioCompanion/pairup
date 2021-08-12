import { SIGNUP_STAGE } from 'store/slices/signup/constants'

type PersonalDetailsProps = {
  visible: boolean
}

export const PersonalDetailsForm = ({ visible }: PersonalDetailsProps) => {
  return (
    <fieldset
      disabled={!visible}
      style={{ display: visible ? 'block' : 'none' }}
    ></fieldset>
  )
}
