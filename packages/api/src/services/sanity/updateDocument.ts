import { IdentifiedSanityDocumentStub } from '@sanity/client'
import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { getSanityClientWrite } from '../../lib/sanity'

export const updateDocument = async (
  document: IdentifiedSanityDocumentStub
) => {
  try {
    const sanityClient = getSanityClientWrite()

    // Create new document
    await sanityClient.patch(document._id).set(document).commit()
  } catch (err) {
    const errMsg = 'Failed to update sanity profile'
    Logger.error(errMsg, err)
    /**
     * If this fails we don't want to have to ask the
     * pairer for their details again so instead we
     * just send the profile to Sentry as an extra and
     * we can make the profile manually
     */
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
        profile: document,
      })
    )
  }
}
