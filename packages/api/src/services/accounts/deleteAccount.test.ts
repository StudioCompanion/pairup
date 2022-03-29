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
        AdminClient: () => jest.fn(),
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

      expect(sendEmailWithTemplateMock).toHaveBeenCalledTimes(
        activeSessions.length
      )
    })

    it('should remove the sender signature from postmark', async () => {
      const removeSenderSignatureMock = jest.fn()
      jest.resetModules()
      jest.unmock('postmark')

      jest.doMock('postmark', () => ({
        ServerClient: () => jest.fn(),
        AdminClient: () => ({
          deleteSenderSignature: removeSenderSignatureMock,
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

      expect(removeSenderSignatureMock).toHaveBeenCalledWith(
        parseInt(testData.users[1].senderSignatureId ?? '0')
      )
    })

    it('should remove my profile from sanity', async () => {
      const deleteMock = jest.fn()

      jest.resetModules()
      jest.doMock('@sanity/client', () => {
        return () => {
          // @ts-ignore
          const client = {
            delete: deleteMock,
          }
          return client
        }
      })

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

      expect(deleteMock).toHaveBeenCalledWith({
        query: `*[_type == 'pairerProfile' && uuid == '${testData.users[1].userId}']`,
      })
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
