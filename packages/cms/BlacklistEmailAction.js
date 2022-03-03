import { useState, useEffect } from 'react'
import { useDocumentOperation } from '@sanity/react-hooks'

export const BlacklistEmailAction = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [isPublishing, props.draft])

  if (props.type !== 'blacklistedEmails') {
    return null
  }

  return {
    label: 'Blacklist Email',
    onHandle: async () => {
      await window.alert(
        '⚠️ Blacklisting an email will resolve in deleting the user permanently from the database. \n Are you sure?'
      )
      // This will update the button text
      setIsPublishing(true)

      // Perform the publish
      publish.execute()

      // Signal that the action is completed
      props.onComplete()
    },
  }
}
