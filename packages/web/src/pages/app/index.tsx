import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SLUG_SIGNUP } from 'references/slugs'

import { useGetCurrentUserQuery } from '../../client/graphql/getCurrentUser.generated'

export default function Dashboard() {
  const router = useRouter()
  const [{ data, fetching, error }] = useGetCurrentUserQuery()
  const [name, setName] = useState('')

  if (fetching) return <p>Loading...</p>

  if (error) return <p>{error.message}</p>

  if (!data?.currentUser) {
    if (process.browser) router.push(SLUG_SIGNUP)
    return (
      <p>
        Redirecting to <Link href={SLUG_SIGNUP}>{SLUG_SIGNUP}</Link>
        ...
      </p>
    )
  }

  return (
    <>
      <h1>Hello {data.currentUser.email}!</h1>
      <input
        placeholder="Hooli Inc."
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
      <Link href="/app/settings">Settings</Link>
      <Link href="/api/auth/logout">Logout</Link>
    </>
  )
}
