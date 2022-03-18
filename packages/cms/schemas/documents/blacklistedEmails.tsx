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
      validation: (Rule) =>
        Rule.regex(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
          {
            name: 'email', // Error message is "Does not match email-pattern"
            invert: false, // Boolean to allow any value that does NOT match pattern
          }
        ),
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
