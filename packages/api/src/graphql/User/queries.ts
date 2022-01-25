import { extendType, nonNull, stringArg } from 'nexus'

import { prisma } from '../../db/prisma'

export const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('currentUser', {
      type: 'User',
      resolve: (_, __) => {
        return {
          userId: '0',
          email: 'hello',
          role: 'PAIREE',
        }
      },
    })
    t.field('userIsEmailUnique', {
      type: 'Boolean',
      description:
        'Check if the email address submitted by a user or persepctive user has already been used before',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_, { email }) => {
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        return user === null
      },
    })
  },
})
