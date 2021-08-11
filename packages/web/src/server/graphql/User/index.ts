import { extendType, nonNull, objectType, stringArg } from 'nexus'
import prisma from '../../db/prisma'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.firstName()
    t.model.email()
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('currentUser', {
      type: 'User',
      resolve: (_, __, ctx) => {
        if (!ctx.user?.id) return null

        return prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })
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
        firstName: stringArg(),
      },
      resolve: async (_, { userId, firstName }, ctx) => {
        if (!ctx.user?.id || userId !== ctx.user.id) return null

        return await prisma.user.update({
          where: { id: userId },
          data: { firstName: firstName || '' },
        })
      },
    })
  },
})

export default [User, mutations, queries]
