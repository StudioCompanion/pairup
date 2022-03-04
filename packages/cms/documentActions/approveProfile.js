import { useState, useEffect } from 'react'
import { useDocumentOperation } from '@sanity/react-hooks'
import { PAIRER_PROFILE_STATUS } from '@pairup/shared'

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
    disabled: publish.disabled || !document.hasVerifiedAccount,
    label: isPublishing ? 'Publishing Profile' : 'Approve Profile',
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
