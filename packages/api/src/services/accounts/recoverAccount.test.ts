import { GraphQLResolveInfo } from 'graphql'

import { testData } from 'test/seed/data'

import { prisma } from '../../db/prisma'

describe('service recoverAccount', () => {
  it('should send the user an email if the user exists', async () => {
    const sendEmailWithTemplateMock = jest.fn()
    jest.resetModules()
    jest.unmock('postmark')

    jest.doMock('postmark', () => ({
      ServerClient: () => ({
        sendEmailWithTemplate: sendEmailWithTemplateMock,
      }),
    }))

    const { recoverAccount: mockedRecoverAccount } = require('./recoverAccount')

    await mockedRecoverAccount(
      {},
      {
        email: testData.users[0].email,
      },
      {
        prisma,
      },
      null as unknown as GraphQLResolveInfo
    )

    expect(sendEmailWithTemplateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        To: testData.users[0].email,
        From: process.env.POSTMARK_FROM_EMAIL,
        TemplateId: Number(process.env.POSTMARK_TEMPLATE_ID_RECOVER),
        TemplateModel: expect.any(Object),
      })
    )
  })

  it('should NOT send the user an email if the user exists', async () => {
    const sendEmailWithTemplateMock = jest.fn()
    jest.resetModules()
    jest.unmock('postmark')

    jest.doMock('postmark', () => ({
      ServerClient: () => ({
        sendEmailWithTemplate: sendEmailWithTemplateMock,
      }),
    }))

    const { recoverAccount: mockedRecoverAccount } = require('./recoverAccount')

    await mockedRecoverAccount(
      {},
      {
        email: 'superuser@companion.studio',
      },
      {
        prisma,
      },
      null as unknown as GraphQLResolveInfo
    )

    expect(sendEmailWithTemplateMock).not.toHaveBeenCalled()
  })
})
