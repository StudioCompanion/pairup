import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { SLUG_SIGNUP_ACCOUNT_DETAILS } from 'references/slugs'

const SignUp = () => {
  return (
    <Link href={SLUG_SIGNUP_ACCOUNT_DETAILS}>
      <a>
        <FormattedMessage id="signup-cta" />
      </a>
    </Link>
  )
}

export default SignUp
