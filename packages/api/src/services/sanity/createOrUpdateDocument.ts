import { IdentifiedSanityDocumentStub } from '@sanity/client'
import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { getSanityClientWrite } from '../../lib/sanity'

export const createOrUpdateDocument = async (
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

    // Create new document / patch existing
    await sanityClient
      .transaction()
      .createIfNotExists(workingDocument)
      .patch(workingId, (patch) => patch.set(workingDocument))
      .commit()

    // Check for and patch draft document, if present
    const draft = await sanityClient.getDocument(draftId)
    if (!createAsDraft && draft) {
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
