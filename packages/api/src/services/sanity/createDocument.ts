import { IdentifiedSanityDocumentStub } from '@sanity/client'
import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { getSanityClientWrite } from '../../lib/sanity'

export const createDocument = async (
  document: IdentifiedSanityDocumentStub,
  createAsDraft = false
) => {
  try {
    const sanityClient = getSanityClientWrite()

    const draftId = `drafts.${document._id}`
    const workingId = createAsDraft ? draftId : document._id

    const workingDocument = Object.assign({}, document, {
      _id: workingId,
    })

    // Create new document
    await sanityClient.transaction().createIfNotExists(workingDocument).commit()
  } catch (err) {
    const errMsg = 'Failed to create sanity profile after account creation'
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
