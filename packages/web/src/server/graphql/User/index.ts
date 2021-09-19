import { extendType, nonNull, objectType, stringArg } from 'nexus'
import prisma from '../../db/prisma'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.userId()
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
        email: stringArg(),
        hashedPassword: stringArg(),
        salt: stringArg(),
      },
      resolve: async (_, { userId, email, hashedPassword, salt }, ctx) => {
        if (!ctx.user?.userId || userId !== ctx.user.userId) return null

        return await prisma.user.update({
          where: { userId },
          data: {
            email: email ?? undefined,
            hashedPassword: hashedPassword ?? undefined,
            salt: salt ?? undefined,
          },
        })
      },
    })
  },
})

export default [User, mutations, queries]
