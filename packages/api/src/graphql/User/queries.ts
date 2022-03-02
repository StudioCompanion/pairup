import { extendType, nonNull, stringArg } from 'nexus'

import { prisma } from '../../db/prisma'

import { getSanityClientRead } from '../../lib/sanity'

export const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('userIsEmailUnique', {
      type: 'Boolean',
      description:
        'Check if the email address submitted by a user or persepctive user has already been used before or is blacklisted',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_, { email }) => {
        const prismaUser = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        const sanityClient = getSanityClientRead()

        const query = /* groq */ `*[_type == 'blacklistedEmails' && email == $email]{email}`

        const sanityUser = await sanityClient.fetch(query, {
          email: email,
        })

        return prismaUser === null && sanityUser.length === 0
      },
    })
  },
})
