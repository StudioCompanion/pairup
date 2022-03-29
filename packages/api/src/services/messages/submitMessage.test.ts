import { GraphQLResolveInfo } from 'graphql'
import { testData } from 'test/seed/data'
import { prisma } from '../../db/prisma'

import { submitMessage } from './submitMessage'

describe('submitMessage', () => {
  describe('assuming the session exists', () => {
    it('should call sendMessage', async () => {
      const sendEmailMock = jest.fn()
      jest.resetModules()
      jest.unmock('postmark')

      jest.doMock('postmark', () => ({
        ServerClient: () => ({
          sendEmail: sendEmailMock,
        }),
        AdminClient: jest.fn(),
      }))

      const { submitMessage: mockedSubmitMessage } = require('./submitMessage')

      await mockedSubmitMessage(
        {},
        {
          message: 'hello there!',
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

      expect(sendEmailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          To: testData.sessions[0].email,
          From: `${testData.users[1].userId}@pair-up.co.uk`,
          ReplyTo: `reply+${testData.users[1].userId}_${testData.sessions[0].id}@pair-up.co.uk`,
          Subject: `Re: PairUp Session ${testData.sessions[0].appointment}`,
          MessageStream: 'outbound',
          TextBody: 'hello there!',
        })
      )
    })
  })

  describe('assuming the session does not exist', () => {
    it('should fail saying the sessionId is wrong', async () => {
      const res = await submitMessage(
        {},
        {
          message: 'hello',
          sessionId: 'test',
        },
        {
          prisma,
          user: {
            userId: '123',
          },
        },
        null as unknown as GraphQLResolveInfo
      )

      expect(res).toMatchInlineSnapshot(`
        Object {
          "Message": null,
          "MessageInputError": Array [
            Object {
              "errorCode": "NotFound",
              "input": "sessionId",
              "message": "No session found with this ID",
            },
          ],
        }
      `)
    })
  })
})
