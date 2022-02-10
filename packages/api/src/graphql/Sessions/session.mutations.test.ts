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
})
