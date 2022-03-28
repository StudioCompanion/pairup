import { GraphQLResolveInfo } from 'graphql'
import { testData } from 'test/seed/data'

import { prisma } from '../../db/prisma'

import { createSession } from './createSession'

describe('service createSession', () => {
  it('should add the session to the database, connect it to a pairer, connect it to a pairerAlias and add the message to the DB', async () => {
    const message = 'Hello I want to pair pls'
    const res = await createSession(
      {},
      {
        pairerId: testData.users[0].userId,
        paireeDetails: {
          firstName: testData.paireeAliases[0].firstName,
          email: testData.paireeAliases[0].email,
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

    /**
     * Adding the Session to the DB
     */
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

    /**
     * Make sure the session has the Pairer attached
     */
    expect(
      user?.sessions.some((sesh) => sesh.id === res?.Session?.id)
    ).toBeTruthy()

    const messages = await prisma.message.findMany({
      where: {
        sessionId: res?.Session?.id,
      },
    })

    /**
     * Check the message was added to the DB
     */
    expect(messages).toHaveLength(1)
    expect(messages[0].message).toEqual(message)

    /**
     * Check its connected to the paireeAlias
     */
    const pairee = await prisma.paireeAlias.findUnique({
      where: {
        email: testData.paireeAliases[0].email,
      },
      include: {
        sessions: true,
      },
    })

    /**
     * there will already be the default one
     * from the db seed
     */
    expect(pairee?.sessions.length).toEqual(2)
    expect(
      pairee?.sessions.find((sesh) => sesh.id === res?.Session?.id)
    ).toEqual(res?.Session)
  })

  it('should send an email to the pairee and pairer about their new session', async () => {
    const sendEmailWithTemplateMock = jest.fn()
    jest.resetModules()
    jest.unmock('postmark')

    jest.doMock('postmark', () => ({
      ServerClient: () => ({
        sendEmailWithTemplate: sendEmailWithTemplateMock,
      }),
      AdminClient: () => ({}),
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
