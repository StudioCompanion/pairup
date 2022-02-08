import { createClient, dedupExchange, errorExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'

/**
 * Consistently determine the API URL for the current client even when in a deploy preview or similar
 */
const getAPIURl = (): string => {
  // Finally, fallback to hard-coded URL in case nothing else works
  if (!process.env.IS_PRODUCTION) return `http://192.168.1.2:3000/graphql`

  return process.env.GRAPHQL_ENDPOINT ?? ''
}

export const client = createClient({
  exchanges: [
    errorExchange({
      onError: (error) => {
        console.error(error.message.replace('[GraphQL]', 'Server error:'))
      },
    }),
    dedupExchange,
    cacheExchange(),
    fetchExchange,
  ],
  fetchOptions: {
    credentials: 'include',
  },
  requestPolicy: `cache-and-network`,
  url: getAPIURl(),
})
