import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'
import { Provider } from 'urql'
import { IntlProvider } from 'react-intl'

import { client } from 'graphql/client'

import Layout from 'components/Layout'

import messages from 'references/locale'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <IntlProvider messages={messages['en']} locale={'en'}>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </IntlProvider>
    </Provider>
  )
}

export default CustomApp
