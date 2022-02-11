import { GraphQLResolveInfo } from 'graphql'
import { testData } from 'test/seed/data'

import { prisma } from '../../db/prisma'
import { cancelSession } from './cancelSession'

describe('service createSession', () => {
  it('should cancel the session in the database', async () => {
    await cancelSession(
      {},
      {
        sessionId: testData.sessions[0].id,
      },
      {
        prisma,
        user: {
          userId: testData.users[1].userId,
        },
      },
      null as unknown as GraphQLResolveInfo
    )

    expect(
      (
        await prisma.session.findUnique({
          where: {
            id: testData.sessions[0].id,
          },
        })
      )?.status
    ).toEqual('CANCELLED')
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

    const { cancelSession: mockedCancelSession } = require('./cancelSession')

    await mockedCancelSession(
      {},
      {
        sessionId: testData.sessions[0].id,
      },
      {
        prisma,
        user: {
          userId: testData.users[1].userId,
        },
      },
      null as unknown as GraphQLResolveInfo
    )

    expect(sendEmailWithTemplateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        To: testData.sessions[0].email,
        From: process.env.POSTMARK_FROM_EMAIL,
        TemplateId: Number(process.env.POSTMARK_TEMPLATE_ID_CANCELLED_SESSION),
        TemplateModel: expect.any(Object),
      })
    )
  })
})
