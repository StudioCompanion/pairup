import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'

describe('Queries', () => {
  describe('checkEmailIsUnique', () => {
    it('should return false if the email exists', async () => {
      expect(
        await request(
          graphql`
            query checkEmailIsUnique($email: String!) {
              userIsEmailUnique(email: $email)
            }
          `,
          {
            variables: {
              email: testData.users[0].email,
            },
          }
        )
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userIsEmailUnique": true,
          },
        }
      `)
    })

    it('should return true if the email does not exists', async () => {
      expect(
        await request(
          graphql`
            query checkEmailIsUnique($email: String!) {
              userIsEmailUnique(email: $email)
            }
          `,
          {
            variables: {
              email: 'test@testing.com',
            },
          }
        )
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userIsEmailUnique": false,
          },
        }
      `)
    })
  })
})
