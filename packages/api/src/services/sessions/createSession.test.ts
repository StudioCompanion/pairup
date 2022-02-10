import { GraphQLResolveInfo } from 'graphql'
import { testData } from 'test/seed/data'

import { prisma } from '../../db/prisma'

import { createSession } from './createSession'

describe('service createSession', () => {
  it('should add the session to the database and connect it to a pairer', async () => {
    const res = await createSession(
      {},
      {
        pairerId: testData.users[0].userId,
        paireeDetails: {
          firstName: 'John',
          email: 'john@john.com',
          timezone: 'GMT +1',
          appointment: 'NOW-NOW',
          message: 'Hello I want to pair pls',
        },
      },
      {
        prisma,
        user: {
          userId: null,
        },
      },
      null as unknown as GraphQLResolveInfo
    )

    expect(
      await prisma.session.findUnique({
        where: {
          id: res?.Session?.id,
        },
      })
    ).toBeTruthy()

    const user = await prisma.user.findFirst({
      where: {
        userId: testData.users[0].userId,
      },
      include: {
        sessions: true,
      },
    })

    expect(
      user?.sessions.some((sesh) => sesh.id === res?.Session?.id)
    ).toBeTruthy()
  })
})
