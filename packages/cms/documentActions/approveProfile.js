import { useState, useEffect } from 'react'
import { useDocumentOperation } from '@sanity/react-hooks'
import { PAIRER_PROFILE_STATUS } from '@pairup/shared'
import { CheckCircle } from 'phosphor-react'

export const ApproveProfile = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  const document = props.draft || props.published

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [isPublishing, props.draft])

  return {
    disabled: publish.disabled || (document && !document.hasVerifiedAccount),
    label: isPublishing ? 'Publishing Profile...' : 'Approve Profile',
    icon: CheckCircle,
    title:
      document && !document.hasVerifiedAccount
        ? 'A user must verify their account before it can be approved'
        : !props.draft
        ? `This profile has all it's changes approved`
        : '',
    onHandle: () => {
      // This will update the button text
      setIsPublishing(true)

      patch.execute([{ set: { status: PAIRER_PROFILE_STATUS.APPROVED } }])

      // Perform the publish
      publish.execute()

      // Signal that the action is completed
      props.onComplete()
    },
  }
}
