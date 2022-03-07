import React, { useState } from 'react'
import { Pencil } from 'phosphor-react'
import { Button, TextArea, Heading, useToast } from '@sanity/ui'

import { createToken } from '../helpers/tokens'

export const SendFeedbackOnProfile = (props) => {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [content, setContent] = useState('')

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
        `${process.env.SANITY_STUDIO_SERVER_ENDPOINT}/send/profileFeedback`,
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
          title: 'Successfully sent feedback!',
          status: 'success',
        })
      } else {
        throw Error(res)
      }

      props.onComplete()

      setDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.push({
        title: 'There was an error submitting your feedback, please try again.',
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
    disabled: props.draft === null,
    title:
      props.draft === null
        ? 'You can only feedback on an un-approved profile'
        : '',
    label: isSendingFeedback ? 'Sending Feedback...' : 'Feedback',
    icon: Pencil,
    onHandle: () => {
      setDialogOpen(true)
    },
    dialog: dialogOpen && {
      type: 'modal',
      onClose: props.onComplete,
      content: (
        <div>
          <Heading as="h2">Send Feedback</Heading>
          <p>Remember, feedback should be constructive & actionable.</p>
          <TextArea
            placeholder="Hi there!"
            onChange={handleTextAreaChange}
            value={content}
            rows={8}
          />
          <Button
            onClick={handleClick}
            text={isSendingFeedback ? 'Submitting...' : 'Submit'}
            tone="primary"
            disabled={isSendingFeedback}
            style={{ marginTop: 20 }}
          />
        </div>
      ),
    },
  }
}
