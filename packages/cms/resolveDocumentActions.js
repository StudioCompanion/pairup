// import the default document actions
import defaultResolve, {
  PublishAction,
  UnpublishAction,
  DiscardChangesAction,
  DeleteAction,
} from 'part:@sanity/base/document-actions'

import { LOCKED_DOCUMENT_TYPES, LOCKED_DOCUMENT_IDS } from './constants'

const lockedDocs = [...LOCKED_DOCUMENT_TYPES, ...LOCKED_DOCUMENT_IDS]

const getDefaults = (props) => {
  const { type } = props

  if (type === 'pairerProfile') {
    return defaultResolve(props).filter(
      (action) =>
        action === PublishAction ||
        action === UnpublishAction ||
        action === DeleteAction
    )
  }

  if (lockedDocs.includes(type)) {
    return defaultResolve(props).filter(
      (action) => action === PublishAction || action === DiscardChangesAction
    )
  }

  return defaultResolve(props)
}

export default function resolveDocumentActions(props) {
  return [
    // Start with Sanity's default actions:
    ...getDefaults(props),
    // And add our custom actions
  ]
}