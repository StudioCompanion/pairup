import { GraphQLResolveInfo } from 'graphql'
import { testData } from 'test/seed/data'

import { prisma } from '../../db/prisma'

import { deleteAccount } from './deleteAccount'

describe('service deleteAccount', () => {
  const deleteFunction = async (id: string) => {
    await deleteAccount(
      {},
      {},
      {
        prisma,
        user: {
          userId: id,
        },
      },
      null as unknown as GraphQLResolveInfo
    )
  }

  describe('assuming the userId exists', () => {
    it('should delete the sessions from the database', async () => {
      await deleteFunction(testData.users[1].userId)

      expect(
        await prisma.session.findMany({
          where: { pairerId: testData.users[1].userId },
        })
      ).toEqual([])
    })

    it('should email the pairee`s from the deleted sessions', async () => {
      const sendEmailWithTemplateMock = jest.fn()
      jest.resetModules()
      jest.unmock('postmark')

      jest.doMock('postmark', () => ({
        ServerClient: () => ({
          sendEmailWithTemplate: sendEmailWithTemplateMock,
        }),
      }))

      const { deleteAccount: mockedDeleteAccount } = require('./deleteAccount')

      await mockedDeleteAccount(
        {},
        {},
        {
          prisma,
          user: {
            userId: testData.users[1].userId,
          },
        },
        null as unknown as GraphQLResolveInfo
      )

      const activeSessions = testData.sessions.filter(
        (sesh) => sesh.status === 'ACTIVE'
      )

      activeSessions.map((sesh, i) => {
        expect(sendEmailWithTemplateMock).toHaveBeenNthCalledWith(
          i + 1,
          expect.objectContaining({
            To: sesh.email,
            From: process.env.POSTMARK_FROM_EMAIL,
            TemplateId: Number(
              process.env.POSTMARK_TEMPLATE_ID_CANCELLED_SESSION
            ),
            TemplateModel: expect.any(Object),
          })
        )
      })

      expect(sendEmailWithTemplateMock).toHaveBeenCalledTimes(
        activeSessions.length
      )
    })

    it('should delete the account from the database', async () => {
      await deleteFunction(testData.users[1].userId)

      expect(
        await prisma.user.findUnique({
          where: { userId: testData.users[1].userId },
        })
      ).toBeNull()
    })
  })

  describe('assuming the userId does not exist', () => {
    it('should throw an error', () => {
      expect(deleteFunction('kbhjdfskbjdf')).rejects.toThrowError(
        'User must be logged in'
      )
    })
  })
})
