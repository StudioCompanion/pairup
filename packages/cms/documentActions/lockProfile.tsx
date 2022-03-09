import React, { useState, useEffect } from 'react'
import { LockKey } from 'phosphor-react'
import { Button, TextArea, Heading, useToast } from '@sanity/ui'
import { useDocumentOperation } from '@sanity/react-hooks'
import { PAIRER_PROFILE_STATUS } from '@pairup/shared'

export const LockProfile = (props) => {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [content, setContent] = useState('')

  const { unpublish, publish, patch } = useDocumentOperation(
    props.id,
    props.type
  ) as {
    unpublish: {
      execute: () => void
    }
    publish: {
      execute: () => void
    }
    patch: {
      execute: (args: unknown) => void
    }
  }

  const document = props.draft || props.published

  return {
    color: 'warning',
    disabled: document && document.status === PAIRER_PROFILE_STATUS.LOCKED,
    title: "Lock a user's profile",
    label: 'Lock Profile',
    icon: LockKey,
    onHandle: () => {
      setDialogOpen(true)
    },
    dialog: dialogOpen && {
      type: 'modal',
      onClose: props.onComplete,
      content: (
        <div>
          <Heading as="h2">Reject Profile</Heading>
          <p>
            Have you tried giving feedback first? Please provide a reason why
            this profile has to be locked. This will be sent to the Pairer.
          </p>
          <TextArea
            placeholder="We're sorry..."
            onChange={handleTextAreaChange}
            value={content}
            rows={8}
          />
          <Button
            onClick={handleClick}
            text={isSendingFeedback ? 'Submitting...' : 'Submit'}
            tone="caution"
            disabled={isSendingFeedback}
            style={{ marginTop: 20 }}
          />
        </div>
      ),
    },
  }
}
