import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'

describe('User Queries', () => {
  describe('checkEmailIsUnique', () => {
    const query = graphql`
      query checkEmailIsUnique($email: String!) {
        userIsEmailUnique(email: $email)
      }
    `

    it('should return false if the email exists', async () => {
      expect(
        await request(query, {
          variables: {
            email: testData.users[0].email,
          },
        })
      ).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "userIsEmailUnique": false,
            },
          }
        `)
    })

    it('should return true if the email does not exists', async () => {
      expect(
        await request(query, {
          variables: {
            email: 'test@testing.com',
          },
        })
      ).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "userIsEmailUnique": true,
            },
          }
        `)
    })
  })
})
