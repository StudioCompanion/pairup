import {
  PAIRER_PROFILE_STATUS,
  SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES,
  SIGNUP_PERSONAL_DETAIL_FIELD_NAMES,
  SIGNUP_AVAILABILITY_FIELD_NAMES,
  DAYS_OF_THE_WEEK,
} from '@pairup/shared'
import { capitalCase } from 'capital-case'

import { Rule } from '../../types'

export default {
  // __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  name: 'pairerProfile',
  title: 'Parier Profile',
  type: 'document',
  fieldsets: [
    {
      name: 'urls',
      title: 'Urls',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      name: 'availability',
      title: 'Availability',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      name: 'status',
      title: 'Profile Status',
      type: 'string',
      codegen: { required: true },
      validation: (rule: Rule) => rule.required(),
      options: {
        list: Object.values(PAIRER_PROFILE_STATUS).filter((val) =>
          Boolean(val)
        ),
      },
      initialValue: PAIRER_PROFILE_STATUS.AWAITING_APPROVAL,
    },
    {
      name: 'hasVerifiedAccount',
      title: 'Has Verified Account',
      type: 'boolean',
      codegen: { required: true },
      validation: (rule: Rule) => rule.required(),
      initialValue: false,
      readOnly: true,
    },
    {
      name: 'uuid',
      title: 'uuid',
      type: 'string',
      hidden: true,
      codegen: { required: true },
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Created At',
      name: 'createdAt',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Last Modified At',
      name: 'lastModifiedAt',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'First Name',
      name: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.firstName,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Last Name',
      name: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.lastName,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Email',
      name: SIGNUP_ACCOUNT_DETAIL_FIELD_NAMES.email,
      type: 'string',
      codegen: { required: true },
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Job Title',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.jobTitle,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Bio',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.bio,
      type: 'text',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Disciplines',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.disciplines,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
    },
    {
      title: 'Company Url',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.companyUrl,
      type: 'string',
      readOnly: true,
      fieldset: 'urls',
    },
    {
      title: 'Portfolio Url',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.portfolioUrl,
      type: 'string',
      readOnly: true,
      fieldset: 'urls',
    },
    {
      title: 'Twitter',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.twitter,
      type: 'string',
      readOnly: true,
      fieldset: 'urls',
    },
    {
      title: 'Instagram',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.instagram,
      type: 'string',
      readOnly: true,
      fieldset: 'urls',
    },
    {
      title: 'Linkedin',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.linkedin,
      type: 'string',
      readOnly: true,
      fieldset: 'urls',
    },
    {
      title: 'Github',
      name: SIGNUP_PERSONAL_DETAIL_FIELD_NAMES.github,
      type: 'string',
      readOnly: true,
      fieldset: 'urls',
    },
    {
      title: 'Timezone',
      name: SIGNUP_AVAILABILITY_FIELD_NAMES.timezone,
      type: 'string',
      validation: (rule: Rule) => rule.required(),
      readOnly: true,
      codegen: { required: true },
      fieldset: 'availability',
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
      fieldset: 'availability',
    })),
  ],
  validation: (rule: Rule) =>
    rule.custom(
      ({
        hasVerifiedAccount,
        status,
      }: {
        hasVerifiedAccount: boolean
        status: PAIRER_PROFILE_STATUS
      }) => {
        if (
          !hasVerifiedAccount &&
          status !== PAIRER_PROFILE_STATUS.AWAITING_APPROVAL
        ) {
          return "You cant approve a profile if they haven't verified their account"
        } else {
          return true
        }
      }
    ),
  preview: {
    select: {
      title: 'title',
      status: 'status',
      jobTitle: 'jobTitle',
    },
    prepare({ title, status, jobTitle }: { [key: string]: string }) {
      return {
        description: `${jobTitle}`,
        subtitle: status,
        title,
      }
    },
  },
}
