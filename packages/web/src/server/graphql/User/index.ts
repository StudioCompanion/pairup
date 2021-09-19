import { extendType, nonNull, objectType, stringArg } from 'nexus'
import prisma from '../../db/prisma'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('currentUser', {
      type: 'User',
      resolve: (_, __, ctx) => {
        if (!ctx.user?.userId) return null

        return prisma.user.findUnique({
          where: {
            userId: ctx.user.userId,
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
      resolve: async (_, { userId }, ctx) => {
        if (!ctx.user?.userId || userId !== ctx.user.userId) return null

        return await prisma.user.update({
          where: { id: userId },
          data: {},
        })
      },
    })
  },
})

export default [User, mutations, queries]
