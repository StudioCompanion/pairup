import { enumType, inputObjectType, objectType } from 'nexus'
import { User, Role } from 'nexus-prisma'

export const UserType = objectType({
  name: User.$name,
  description: 'An individual user of PairUp',
  definition(t) {
    t.field({
      ...User.userId,
      description: 'Unique identifier of the user in the database',
    })
    t.field({
      ...User.email,
      description: "User's email",
    })
    t.field({
      ...User.role,
      description: "The User's role",
    })
  },
})

export const UserErrorType = objectType({
  name: 'UserError',
  description: 'An error the user has made when submitting a mutation',
  definition: (t) => {
    t.string('message')
    t.string('input')
    t.field('errorCode', {
      type: 'UserErrorCodes',
    })
  },
})

export const UserErrorCodesType = enumType({
  name: 'UserErrorCodes',
  description: 'Possible error codes that can be returned from UserError',
  members: {
    INVALID: 'The input value is invalid, see message',
  },
})

export const UserDisciplinesType = enumType({
  name: 'UserDisciplines',
  description: 'Possible Pairer disciplines',
  members: {
    THREED: '3D',
    UX: 'UX',
    VR: 'VR',
    ARCHITECTURE: 'Architecture',
    BRANDING: 'Branding',
    BUSINESS: 'Business',
    COPYWRITING: 'Copywriting',
    CREATIVITY: 'Creativity',
    DESIGN: 'Design',
    DEVELOPMENT: 'Development',
    ECOMMERCE: 'Ecommerce',
    ENTREPRENEURSHIP: 'Entrepreneurship',
    EXPERIMENTAL: 'Experimental',
    FASHION: 'Fashion',
    GAMES: 'Games',
    ILLUSTRATION: 'Illustration',
    INNOVATION: 'Innovation',
    LEADERSHIP: 'Leadership',
    MOTION: 'Motion',
    MUSIC: 'Music',
    PHOTOGRAPHY: 'Photography',
    PORTFOLIOS: 'Portfolios',
    PRODUCT: 'Product',
    PUBLISHING: 'Publishing',
    REMOTE: 'Remote',
    STRATEGY: 'Strategy',
    SUSTAINABILITY: 'Sustainability',
    WRITING: 'Writing',
  },
})

export const UserRoleType = enumType({
  ...Role,
  description: 'Possible roles a user can have within the database',
})

export const UserMutationReturnType = objectType({
  name: 'UserMutationReturn',
  description:
    'Encapsulates return values of user mutations where input fields could be incorrect',
  definition: (t) => {
    t.field('User', {
      type: 'User',
    })
    t.list.field('UserError', {
      type: 'UserError',
    })
  },
})

export const AvailabilityTimeInputType = inputObjectType({
  name: 'AvailabilityTimeInput',
  description:
    "Defines a start & end time for a section of a Parier's availability during a day",
  definition(t) {
    t.string('startTime')
    t.string('endTime')
  },
})

export const UserAvailabilityInputType = inputObjectType({
  name: 'UserAvailabilityInput',
  description: "A Pairer's availability related to their profile",
  definition(t) {
    t.list.field({
      name: 'monday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'tuesday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'wednesday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'thursday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'friday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'saturday',
      type: 'AvailabilityTimeInput',
    })
    t.list.nullable.field({
      name: 'sunday',
      type: 'AvailabilityTimeInput',
    })
  },
})

export const UserProfileInputType = inputObjectType({
  name: 'UserProfileInput',
  description: "A Pairer's profile that is submitted to the CMS",
  definition(t) {
    t.nonNull.string('firstName', {
      description: "Pairer's first name",
    })
    t.nonNull.string('lastName', {
      description: "Pairer's last name",
    })
    t.nonNull.string('jobTitle', {
      description: "Pairer's job title",
    })
    t.string('companyUrl', {
      description: "Pairer's company url",
    })
    t.string('portfolioUrl', {
      description: "Pairer's portfoli url",
    })
    t.nonNull.string('bio', {
      description: "Pairer's biography",
    })
    t.nonNull.list.field({
      name: 'disciplines',
      type: 'UserDisciplines',
      description: "Pairer's disciplines",
    })
    t.string('twitter', {
      description: "Pairer's twitter url",
    })
    t.string('instagram', {
      description: "Pairer's instagram url",
    })
    t.string('linkedin', {
      description: "Pairer's linkedin url",
    })
    t.string('github', {
      description: "Pairer's github url",
    })
    /**
     * TODO: This probably needs to be an Enum
     */
    t.nonNull.string('timezone', {
      description: "Pairer's timezeon",
    })
    t.nonNull.field({
      name: 'availability',
      description: "Pairer's availability",
      type: 'UserAvailabilityInput',
    })
  },
})
