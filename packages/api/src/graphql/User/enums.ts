import { enumType } from 'nexus'
import { Role } from 'nexus-prisma'

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
