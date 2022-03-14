import { extendType, nonNull, stringArg } from 'nexus'

import { prisma } from '../../db/prisma'

import { getSanityClientRead } from '../../lib/sanity'
import groq from 'groq'

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

        const query = groq`*[_type == 'blacklistedEmails' && email == $email][0]`

        const blacklistEntry = await sanityClient.fetch(query, {
          email: email,
        })

        return !prismaUser && !blacklistEntry
      },
    })
  },
})
