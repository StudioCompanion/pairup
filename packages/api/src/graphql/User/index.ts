import { extendType, nonNull, objectType, stringArg } from 'nexus'
import { User } from 'nexus-prisma'

const UserType = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id)
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('currentUser', {
      type: 'User',
      resolve: (_, __) => {
        return {
          id: 0,
        }
      },
    })
  },
})

const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('updateUser', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
        email: stringArg(),
        hashedPassword: stringArg(),
        salt: stringArg(),
      },
      resolve: () => {
        return {
          id: 0,
        }
      },
    })
  },
})

export default [UserType, mutations, queries]
