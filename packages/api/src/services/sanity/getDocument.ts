import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { getSanityClientWrite } from '../../lib/sanity'

export const getDocument = async (id: string) => {
  try {
    const sanityClient = getSanityClientWrite()

    // Get a document
    return await sanityClient.getDocument(id)
  } catch (err) {
    const errMsg = 'Failed to get sanity profile'
    Logger.error(errMsg, err)

    captureException(
      errMsg,
      new Scope().setExtras({
        err,
        id,
      })
    )
  }
}
