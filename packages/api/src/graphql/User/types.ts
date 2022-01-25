import { enumType, objectType } from 'nexus'
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
