import { z } from 'zod'

export const ABUSE_TYPE_OPTIONS = [
  'Spam or harmful',
  'Harassment or bullying',
  'Pretending to be someone',
  'Something else',
] as const

export const abuseReportSchema = z.object({
  name: z.string().nonempty({
    message: 'Name is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Invalid email address provided',
    })
    .nonempty(),
  description: z.string().nonempty({
    message: 'Description is required',
  }),
  isAbuserPairer: z.boolean({
    required_error: 'isAbuserPairer is required',
    invalid_type_error: 'isActive must be a boolean',
  }),
  abuseType: z.enum(ABUSE_TYPE_OPTIONS),
})
