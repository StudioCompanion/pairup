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
    {
      name: 'pairer',
      title: 'Pairer',
      type: 'boolean',
    },
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'pairer',
    },
    prepare({ title, subtitle }) {
      return {
        media: () => <At />,
        title: title,
        subtitle: subtitle ? 'Pairer' : 'Pairee',
      }
    },
  },
}
