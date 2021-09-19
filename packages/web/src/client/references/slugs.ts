// sign-up
export const SLUG_SIGNUP = '/sign-up'
// sign-in
export const SLUG_SIGNIN = '/sign-in'
// accounts
export const SLUG_ACCOUNT = '/account'
export const SLUG_ACCOUNT_DETAILS = `${SLUG_ACCOUNT}/details`
// verification
export const SLUG_VERIFICATION = '/verify-email'

export enum POST_API_SLUGS {
  EMAILS_CHECK_UNIQUE = '/api/emails/checkUnique',
  ACCOUNTS_SIGN_UP = '/api/accounts/sign-up',
  ACCOUNTS_VERIFY_EMAIL = '/api/accounts/verify-email',
}
