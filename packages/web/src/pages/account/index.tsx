import { SLUG_ACCOUNT_DETAILS } from 'references/slugs'

const AccountHome = () => {
  return null
}

export default AccountHome

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: SLUG_ACCOUNT_DETAILS,
    },
  }
}
