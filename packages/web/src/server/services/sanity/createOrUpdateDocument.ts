/* eslint-disable no-console */
import { getSanityClientWrite } from 'lib/sanity'
import { PairerProfileCreationDocument } from 'types/sanity'

const LABEL = '[services::sanity::createOrUpdateDocument]'

const createOrUpdateDocument = async (
  document: PairerProfileCreationDocument
) => {
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

  console.log(`${LABEL} Completed!`)
}

export default createOrUpdateDocument
