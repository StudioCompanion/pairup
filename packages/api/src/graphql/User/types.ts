import { objectType } from 'nexus'
import { User } from 'nexus-prisma'

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

export const UserCreateAccountMutationReturnType = objectType({
  name: 'UserCreateAccountMutationReturn',
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

export const UserAccessTokenType = objectType({
  name: 'UserAccessToken',
  description:
    'Access token required to make modifications to the User & Messaging',
  definition: (t) => {
    t.nonNull.string('accessToken', {
      description: 'The actual token used to authenticate mutations & queries',
    })
    t.nonNull.date('expiresAt', {
      description: 'ISO 8601 date of when the token expires',
    })
  },
})

export const UserCreateTokenMutationReturnType = objectType({
  name: 'UserCreateTokenMutationReturn',
  description:
    'Encapsulates return values of user mutations where input fields could be incorrect',
  definition: (t) => {
    t.field('UserAccessToken', {
      type: 'UserAccessToken',
    })
    t.list.field('UserError', {
      type: 'UserError',
    })
  },
})
