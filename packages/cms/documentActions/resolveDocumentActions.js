// import the default document actions
import defaultResolve, {
  PublishAction,
  DiscardChangesAction,
  DeleteAction,
} from 'part:@sanity/base/document-actions'

import { LOCKED_DOCUMENT_TYPES, LOCKED_DOCUMENT_IDS } from '../constants'

import { ApproveProfile } from './approveProfile'
import { SendFeedbackOnProfile } from './sendFeedbackOnProfile'
import { RejectProfile } from './rejectProfile'
import { LockProfile } from './lockProfile'

const lockedDocs = [...LOCKED_DOCUMENT_TYPES, ...LOCKED_DOCUMENT_IDS]

const getDefaults = (props) => {
  const { type } = props

  if (type === 'pairerProfile') {
    return [
      ApproveProfile,
      SendFeedbackOnProfile,
      RejectProfile,
      LockProfile,
      ...defaultResolve(props).filter((action) => action === DeleteAction),
    ]
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
