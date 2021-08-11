import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'
import { Provider } from 'urql'

import { client } from 'graphql/client'

import Layout from 'components/Layout'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </Provider>
  )
}

export default CustomApp
