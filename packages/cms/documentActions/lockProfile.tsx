import React, { useState } from 'react'
import { LockKey } from 'phosphor-react'
import { Button, TextArea, Heading, useToast } from '@sanity/ui'
import { useDocumentOperation } from '@sanity/react-hooks'

import { createToken } from '../helpers/tokens'
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

  const toast = useToast()

  const handleClick = async () => {
    try {
      setIsSendingFeedback(true)

      if (
        !process.env.SANITY_STUDIO_SERVER_ENDPOINT ||
        !process.env.SANITY_STUDIO_SECRET
      ) {
        throw new Error(
          'No SANITY_STUDIO_SERVER_ENDPOINT or SANITY_STUDIO_SECRET declared, cannot post feedback.'
        )
      }

      const stringifiedBody = JSON.stringify({
        userProfile: {
          name: document.firstName,
          email: document.email,
        },
        feedback: content,
      })

      const token = await createToken(stringifiedBody)

      const res = await fetch(
        `${process.env.SANITY_STUDIO_SERVER_ENDPOINT}/send/lockProfile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Sanity-Secret-Token': token,
          },
          body: stringifiedBody,
        }
      ).then((res) => res.json())

      if (res.success) {
        toast.push({
          title: 'Successfully rejected this profile!',
          status: 'success',
        })

        patch.execute([{ set: { status: PAIRER_PROFILE_STATUS.REJECTED } }])

        publish.execute()

        unpublish.execute()
      } else {
        throw Error(res)
      }

      props.onComplete()

      setDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.push({
        title: 'There was an error locking the profile, please try again.',
        status: 'error',
      })
    } finally {
      setIsSendingFeedback(false)
    }
  }

  const handleTextAreaChange = ({ currentTarget }) => {
    setContent(currentTarget.value)
  }

  return {
    color: 'warning',
    disabled: document && document.status === PAIRER_PROFILE_STATUS.LOCKED,
    title: "Lock a user's profile",
    label: isSendingFeedback ? 'Locking Profile ...' : 'Lock Profile',
    icon: LockKey,
    onHandle: () => {
      setDialogOpen(true)
    },
    dialog: dialogOpen && {
      type: 'modal',
      onClose: props.onComplete,
      content: (
        <div>
          <Heading as="h2">Lock Profile</Heading>
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
