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

export const UserCreateAccountPayloadType = objectType({
  name: 'UserCreateAccountPayload',
  description:
    'Encapsulates return values of user mutations where input fields could be incorrect',
  definition: (t) => {
    t.field('User', {
      type: 'User',
    })
    t.list.field('Error', {
      type: 'Error',
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

export const UserCreateTokenPayloadType = objectType({
  name: 'UserCreateTokenPayload',
  description: 'Payload from the userCreateToken mutation',
  definition: (t) => {
    t.field('UserAccessToken', {
      type: 'UserAccessToken',
    })
    t.list.field('Error', {
      type: 'Error',
    })
  },
})

export const UserUpdateAccountPayloadType = objectType({
  name: 'UserUpdateAccountPayload',
  description: 'Payload from the userUpdateAccount mutation',
  definition: (t) => {
    t.field('UserAccessToken', {
      type: 'UserAccessToken',
    })
    t.list.field('Error', {
      type: 'Error',
    })
  },
})

export const UserRecoverPayloadType = objectType({
  name: 'UserRecoverPayload',
  description: 'Payload from the userRecover mutation',
  definition: (t) => {
    t.boolean('success')
    t.list.field('Error', {
      type: 'Error',
    })
  },
})
