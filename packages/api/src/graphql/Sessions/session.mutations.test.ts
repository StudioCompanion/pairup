import { graphql, request } from 'test/request'
import { testData } from 'test/seed/data'

describe('session mutations', () => {
  describe('session create', () => {
    const mutation = graphql`
      mutation SessionCreate(
        $paireeDetails: SessionCreatePaireeInput!
        $pairerId: ID!
      ) {
        sessionCreate(paireeDetails: $paireeDetails, pairerId: $pairerId) {
          Session {
            id
          }
          SessionInputError {
            message
            errorCode
            input
          }
        }
      }
    `

    it('should return true if the session has been made', async () => {
      expect(
        await request(mutation, {
          variables: {
            pairerId: testData.users[0].userId,
            paireeDetails: {
              firstName: 'John',
              email: 'john@john.com',
              timezone: 'GMT +1',
              appointment: 'NOW-NOW',
              message: 'Hello I want to pair pls',
            },
          },
        })
      ).toEqual(
        expect.objectContaining({
          data: {
            sessionCreate: {
              Session: {
                id: expect.any(String),
              },
              SessionInputError: [],
            },
          },
        })
      )
    })

    it('should return validation errors if the data structure is not correct', async () => {
      expect(
        await request(mutation, {
          variables: {
            pairerId: testData.users[0].userId,
            paireeDetails: {
              firstName: '',
              email: 'somthing',
              timezone: '',
              appointment: '',
              message: '',
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "sessionCreate": Object {
              "Session": null,
              "SessionInputError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "firstName",
                  "message": "First name required",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "email",
                  "message": "Invalid email address provided",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "timezone",
                  "message": "Timezone is required",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "appointment",
                  "message": "an appointment timeframe is required",
                },
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
  })

  describe('session cancel', () => {
    const mutation = graphql`
      mutation CancelSession($sessionId: ID!) {
        sessionCancel(sessionId: $sessionId) {
          sessionId
          SessionInputError {
            message
            errorCode
            input
          }
        }
      }
    `
    it('should return the cancelled sesion id if successful', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: testData.sessions[0].id,
          },
          context: {
            user: {
              userId: testData.users[1].userId,
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "sessionCancel": Object {
              "SessionInputError": Array [],
              "sessionId": "123",
            },
          },
        }
      `)
    })

    it('should throw if the user is not authenticated', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: testData.sessions[0].id,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "sessionCancel": null,
          },
          "errors": Array [
            [GraphQLError: User must be logged in],
          ],
        }
      `)
    })

    it('should return an error if the user does not have this session attached to them', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: 'abc',
          },

          context: {
            user: {
              userId: testData.users[1].userId,
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "sessionCancel": Object {
              "SessionInputError": Array [
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "sessionId",
                  "message": "Session not found with provided id",
                },
              ],
              "sessionId": "",
            },
          },
        }
      `)
    })

    it('should return an error if the session has already been cancelled', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: testData.sessions[2].id,
          },

          context: {
            user: {
              userId: testData.users[1].userId,
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "sessionCancel": Object {
              "SessionInputError": Array [
                Object {
                  "errorCode": "PAST_EVENT",
                  "input": "sessionId",
                  "message": "Session not found with provided id in User",
                },
              ],
              "sessionId": "",
            },
          },
        }
      `)
    })

    it('should return an error if the session has already been completed', async () => {
      expect(
        await request(mutation, {
          variables: {
            sessionId: testData.sessions[3].id,
          },

          context: {
            user: {
              userId: testData.users[1].userId,
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "sessionCancel": Object {
              "SessionInputError": Array [
                Object {
                  "errorCode": "PAST_EVENT",
                  "input": "sessionId",
                  "message": "Session not found with provided id in User",
                },
              ],
              "sessionId": "",
            },
          },
        }
      `)
    })
  })
})
