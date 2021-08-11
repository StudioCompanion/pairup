import { useState } from 'react'
import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider } from 'urql'
import { IntlProvider } from 'react-intl'

import { client } from 'graphql/client'

import { initStore } from 'store/createStore'

import Layout from 'components/Layout'

import messages from 'references/locale'

function PairUpApp({ Component, pageProps }: AppProps) {
  // Initialize redux store with preloaded state
  const [store] = useState(initStore())

  return (
    <Provider value={client}>
      <ReduxProvider store={store}>
        <IntlProvider messages={messages['en']} locale={'en'}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </IntlProvider>
      </ReduxProvider>
    </Provider>
  )
}

export default PairUpApp
