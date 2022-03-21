import * as React from 'react'
import { capitalCase } from 'capital-case'

import {
  PAIRER_PROFILE_STATUS,
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
  SIGNUP_AVAILABILITY_FIELD_NAMES,
  DAYS_OF_THE_WEEK,
} from '@pairup/shared'

import { Rule } from '../../types'
import { User } from 'phosphor-react'

export default {
  name: 'pairerProfile',
  title: 'Pairer Profile',
  type: 'document',
  groups: [
    {
      name: 'admin',
      title: 'Admin',
      default: true,
    },
    {
      name: 'profile',
      title: 'Profile',
    },
    {
      name: 'urls',
      title: 'Urls',
    },
    {
      name: 'availability',
      title: 'Availability',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'admin',
    },
    {
      name: 'status',
      title: 'Profile Status',
      type: 'string',
      codegen: { required: true },
      readOnly: true,
      validation: (rule: Rule) => rule.required(),
      options: {
        list: Object.values(PAIRER_PROFILE_STATUS).filter((val) =>
          Boolean(val)
        ),
      },
      initialValue: PAIRER_PROFILE_STATUS.AWAITING_APPROVAL,
      group: 'admin',
    },
    {
      name: 'hasVerifiedAccount',
      title: 'Has Verified Account',
      type: 'boolean',
      codegen: { required: true },
      validation: (rule: Rule) => rule.required(),
      initialValue: false,
      readOnly: true,
      group: 'admin',
    },
    {
      name: 'uuid',
      title: 'uuid',
      type: 'string',
      hidden: true,
      codegen: { required: true },
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'admin',
    },
    {
      title: 'Created At',
      name: 'createdAt',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'admin',
    },
    {
      title: 'Last Modified At',
      name: 'lastModifiedAt',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'admin',
    },
    {
      title: 'First Name',
      name: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.firstName,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'profile',
    },
    {
      title: 'Last Name',
      name: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.lastName,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'profile',
    },
    {
      title: 'Email',
      name: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.email,
      type: 'string',
      codegen: { required: true },
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'profile',
    },
    {
      title: 'Job Title',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.jobTitle,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'profile',
    },
    {
      title: 'Bio',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.bio,
      type: 'text',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'profile',
    },
    {
      title: 'Disciplines',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'profile',
    },
    {
      title: 'Company Url',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.companyUrl,
      type: 'string',
      readOnly: true,
      group: 'urls',
    },
    {
      title: 'Portfolio Url',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.portfolioUrl,
      type: 'string',
      readOnly: true,
      group: 'urls',
    },
    {
      title: 'Twitter',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.twitter,
      type: 'string',
      readOnly: true,
      group: 'urls',
    },
    {
      title: 'Instagram',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.instagram,
      type: 'string',
      readOnly: true,
      group: 'urls',
    },
    {
      title: 'Linkedin',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.linkedin,
      type: 'string',
      readOnly: true,
      group: 'urls',
    },
    {
      title: 'Github',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.github,
      type: 'string',
      readOnly: true,
      group: 'urls',
    },
    {
      title: 'Timezone',
      name: SIGNUP_AVAILABILITY_FIELD_NAMES.timezone,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      codegen: { required: true },
      group: 'availability',
    },
    ...Object.values(DAYS_OF_THE_WEEK).map((val) => ({
      title: capitalCase(val),
      name: val,
      type: 'array',
      codegen: { required: true },
      of: [
        {
          name: 'availableTime',
          title: 'Available Time',
          type: 'object',
          readOnly: true,
          fields: [
            {
              name: SIGNUP_AVAILABILITY_FIELD_NAMES.startTime,
              title: 'Start Time',
              type: 'string',
              validation: (rule: Rule) => rule.required(),
              readOnly: true,
            },
            {
              name: SIGNUP_AVAILABILITY_FIELD_NAMES.endTime,
              title: 'End Time',
              type: 'string',
              validation: (rule: Rule) => rule.required(),
              readOnly: true,
            },
          ],
          preview: {
            select: {
              startTime: 'startTime',
              endTime: 'endTime',
            },
            prepare({
              startTime,
              endTime,
            }: {
              startTime: string
              endTime: string
            }) {
              return {
                title: `${startTime} - ${endTime}`,
              }
            },
          },
        },
      ],
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      group: 'availability',
    })),
  ],
  validation: (rule: Rule) =>
    rule.custom(({ hasVerifiedAccount }: { hasVerifiedAccount: boolean }) => {
      if (!hasVerifiedAccount) {
        return "You cant approve a profile if they haven't verified their account"
      } else {
        return true
      }
    }),
  preview: {
    select: {
      title: 'title',
      status: 'status',
      jobTitle: 'jobTitle',
      hasVerifiedAccount: 'hasVerifiedAccount',
    },
    prepare({
      title,
      status,
      jobTitle,
      hasVerifiedAccount,
    }: {
      [key: string]: string
    }) {
      return {
        media: () => <User />,
        description: `${jobTitle}`,
        subtitle:
          status === PAIRER_PROFILE_STATUS.LOCKED
            ? 'Locked'
            : status === PAIRER_PROFILE_STATUS.REJECTED
            ? 'Rejected'
            : status === PAIRER_PROFILE_STATUS.APPROVED && hasVerifiedAccount
            ? 'Approved Account'
            : 'Requires Approval',
        title,
      }
    },
  },
}
