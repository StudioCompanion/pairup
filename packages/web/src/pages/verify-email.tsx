import { GetServerSideProps } from 'next'

export type VerifyEmailPageProps = {
  success: boolean
  fail?: string | undefined
}

const VerifyEmailPage = ({ success, fail }: VerifyEmailPageProps) => {
  return (
    <div>
      <h1>Verify Email</h1>
      <h2>Status is {success}</h2>
      {!success ? <p>{fail}</p> : null}
    </div>
  )
}

type VerifyEmailPageQuery = {
  success?: string
  fail?: string
}

export const getServerSideProps: GetServerSideProps<
  VerifyEmailPageProps,
  VerifyEmailPageQuery
  // eslint-disable-next-line @typescript-eslint/require-await
> = async ({ query }) => {
  try {
    const { success, fail } = query
    if (!success || !fail) {
      throw new Error()
    } else {
      return {
        props: {
          success: Boolean(success === 'true'),
          fail: fail as string,
        },
      }
    }
  } catch {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default VerifyEmailPage
