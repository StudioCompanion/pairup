import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'

describe('User Mutations', () => {
  describe('userCreateAccount', () => {
    const mutation = graphql`
      mutation UserCreateAccount($email: String!, $password: String!) {
        userCreateAccount(email: $email, password: $password) {
          User {
            email
          }
          UserError {
            errorCode
            input
            message
          }
        }
      }
    `

    it('should return a User object if creating the account was successful', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'josh@gmail.com',
            password: 'DVUE8j=uQ;?>,6w%EOh8',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccount": Object {
              "User": Object {
                "email": "josh@gmail.com",
              },
              "UserError": null,
            },
          },
        }
      `)
    })

    it('should return a UserErrors list if the password is not strong enough', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'josh@gmail.com',
            password: 'hello',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccount": Object {
              "User": null,
              "UserError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "password",
                  "message": "Password must be at least 8 characters long, contain 1 special character, 1 number, 1 capital and 1 lowercase letter",
                },
              ],
            },
          },
        }
      `)
    })

    it('should return a UserErrors list if the email is not an email', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'josh',
            password: 'DVUE8j=uQ;?>,6w%EOh8',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccount": Object {
              "User": null,
              "UserError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "email",
                  "message": "Invalid email address provided",
                },
              ],
            },
          },
        }
      `)
    })

    it('should return a UserErrors list if the email has already been used', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: testData.users[0].email,
            password: 'DVUE8j=uQ;?>,6w%EOh8',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccount": Object {
              "User": null,
              "UserError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "email",
                  "message": "This email address has already been used",
                },
              ],
            },
          },
        }
      `)
    })

    it('should return a UserErrors list with both inputs listed if neither are correct', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'josh',
            password: 'hello',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccount": Object {
              "User": null,
              "UserError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "email",
                  "message": "Invalid email address provided",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "password",
                  "message": "Password must be at least 8 characters long, contain 1 special character, 1 number, 1 capital and 1 lowercase letter",
                },
              ],
            },
          },
        }
      `)
    })
  })
})
