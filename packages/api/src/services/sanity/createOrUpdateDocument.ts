import { IdentifiedSanityDocumentStub } from '@sanity/client'
import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { getSanityClientWrite } from '../../lib/sanity'

export const createOrUpdateDocument = async (
  document: IdentifiedSanityDocumentStub
) => {
  try {
    const sanityClient = getSanityClientWrite()

    // Create new document / patch existing
    await sanityClient
      .transaction()
      .createIfNotExists(document)
      .patch(document._id, (patch) => patch.set(document))
      .commit()

    // Check for and patch draft document, if present
    const draftId = `drafts.${document._id}`
    const draft = await sanityClient.getDocument(draftId)
    if (draft) {
      const documentDraft = Object.assign({}, document, {
        _id: draftId,
      })

      await sanityClient
        .transaction()
        .patch(draftId, (patch) => patch.set(documentDraft))
        .commit()
    }
  } catch (err) {
    const errMsg = 'Failed to create sanity profile after account creation'
    Logger.error(errMsg)
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
