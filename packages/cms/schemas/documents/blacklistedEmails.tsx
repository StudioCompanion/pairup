import * as React from 'react'
import { At } from 'phosphor-react'

export default {
  name: 'blacklistedEmails',
  title: 'Blacklisted Emails',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'email',
    },
    prepare({ title }) {
      return {
        media: () => <At />,
        title: title,
      }
    },
  },
}
