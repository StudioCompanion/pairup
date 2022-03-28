import { graphql, request } from 'test/request'
import { testData } from 'test/seed/data'

describe('message mutations', () => {
  describe('message submit', () => {
    const mutation = graphql`
      mutation MessageSubmit($message: String!, $sessionId: ID!) {
        messageSubmit(message: $message, sessionId: $sessionId) {
          Message {
            sessionId
            message
            id
          }
          MessageInputError {
            errorCode
            input
            message
          }
        }
      }
    `

    it('should return true if the session has been made', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: testData.sessions[0].id,
            message: 'Hello I am a message',
          },
        })
      ).toEqual(
        expect.objectContaining({
          data: {
            messageSubmit: {
              Message: {
                id: expect.any(String),
                message: 'Hello I am a message',
                sessionId: testData.sessions[0].id,
              },
              MessageInputError: [],
            },
          },
        })
      )
    })

    it('should return validation errors if the data structure is not correct', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: testData.sessions[0].id,
            message: '',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "messageSubmit": Object {
              "Message": null,
              "MessageInputError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "message",
                  "message": "a message is required",
                },
              ],
            },
          },
        }
      `)
    })

    it('should return validation errors if the session does not exist', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: 'null',
            message: 'hello',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "messageSubmit": Object {
              "Message": null,
              "MessageInputError": Array [
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "sessionId",
                  "message": "No session found with this ID",
                },
              ],
            },
          },
        }
      `)
    })
  })
})
