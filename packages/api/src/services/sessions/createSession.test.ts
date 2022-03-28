import { GraphQLResolveInfo } from 'graphql'
import { testData } from 'test/seed/data'

import { prisma } from '../../db/prisma'

import { createSession } from './createSession'

describe('service createSession', () => {
  it('should add the session to the database and connect it to a pairer', async () => {
    const message = 'Hello I want to pair pls'
    const res = await createSession(
      {},
      {
        pairerId: testData.users[0].userId,
        paireeDetails: {
          firstName: 'John',
          email: 'john@john.com',
          timezone: 'GMT +1',
          appointment: 'NOW-NOW',
          message,
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

    const messages = await prisma.message.findMany({
      where: {
        sessionId: res?.Session?.id,
      },
    })

    expect(messages).toHaveLength(1)
    expect(messages[0].message).toEqual(message)
  })

  it('should send an email to the pairee and pairer about their new session', async () => {
    const sendEmailWithTemplateMock = jest.fn()
    jest.resetModules()
    jest.unmock('postmark')

    jest.doMock('postmark', () => ({
      ServerClient: () => ({
        sendEmailWithTemplate: sendEmailWithTemplateMock,
      }),
    }))

    const { createSession: mockedCreateSession } = require('./createSession')

    const paireeEmail = 'john@john.com'

    await mockedCreateSession(
      {},
      {
        pairerId: testData.users[0].userId,
        paireeDetails: {
          firstName: 'John',
          email: paireeEmail,
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

    expect(sendEmailWithTemplateMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        To: testData.users[0].email,
        From: process.env.POSTMARK_FROM_EMAIL,
        TemplateId: Number(process.env.POSTMARK_TEMPLATE_ID_NEW_SESSION),
        TemplateModel: expect.any(Object),
      })
    )

    expect(sendEmailWithTemplateMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        To: paireeEmail,
        From: process.env.POSTMARK_FROM_EMAIL,
        TemplateId: Number(process.env.POSTMARK_TEMPLATE_ID_NEW_SESSION),
        TemplateModel: expect.any(Object),
      })
    )
  })
})
