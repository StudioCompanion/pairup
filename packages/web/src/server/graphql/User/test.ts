import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'

describe(`currentUser`, () => {
  it(`should return null when unauthenticated`, async () => {
    expect(
      await request(
        graphql`
          {
            currentUser {
              userId
            }
          }
        `
      )
    ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "currentUser": null,
          },
        }
    `)
  })

  it(`should return the current user data when authenticated`, async () => {
    expect(
      await request(
        graphql`
          {
            currentUser {
              userId
            }
          }
        `,
        {
          context: {
            user: testData.users[0],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "currentUser": Object {
            "userId": "f981adbe-991f-4c60-a807-ab574912f223",
          },
        },
      }
    `)
  })
})

describe(`updateUser`, () => {
  it(`should update the user's name`, async () => {
    // Right name initially
    expect(
      await request(
        graphql`
          {
            currentUser {
              userId
            }
          }
        `,
        {
          context: {
            user: testData.users[0],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "currentUser": Object {
            "userId": "f981adbe-991f-4c60-a807-ab574912f223",
          },
        },
      }
    `)

    // Update name
    expect(
      await request(
        graphql`
          mutation updateUser(
            $userId: String!
            $email: String
            $hashedPassword: String
            $salt: String
          ) {
            updateUser(
              userId: $userId
              email: $email
              hashedPassword: $hashedPassword
              salt: $salt
            ) {
              userId
            }
          }
        `,
        {
          context: {
            user: testData.users[0],
          },
          variables: {
            userId: testData.users[0].userId,
            email: testData.users[0].email,
            hashedPassword: testData.users[0].hashedPassword,
            salt: testData.users[0].salt,
          },
        }
      )
    ).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "updateUser": Object {
            "userId": "f981adbe-991f-4c60-a807-ab574912f223",
          },
        },
      }
    `)
  })
})
