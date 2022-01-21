import { extendType, nonNull, objectType, stringArg } from 'nexus'
import { User } from 'nexus-prisma'
// import prisma from '../../db/prisma'

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
      resolve: (_, __, ctx) => {
        return {
          id: 'test',
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
      resolve: async (_, { userId, email, hashedPassword, salt }, ctx) => {
        if (!ctx.user?.userId || userId !== ctx.user.userId) return null

        // return await prisma.user.update({
        //   where: { userId },
        //   data: {
        //     email: email ?? undefined,
        //     hashedPassword: hashedPassword ?? undefined,
        //     salt: salt ?? undefined,
        //   },
        // })
      },
    })
  },
})

export default [UserType, mutations, queries]
