import { extendType, nonNull, objectType, stringArg } from 'nexus'
import { User } from 'nexus-prisma'

import { prisma } from '../../db/prisma'

const UserType = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id)
    t.field(User.email)
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
          email: 'hello',
        }
      },
    })
    t.field('userIsEmailUnique', {
      type: 'Boolean',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_, { email }) => {
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        return user !== null
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
          email: 'hello',
        }
      },
    })
  },
})

export default [UserType, mutations, queries]
