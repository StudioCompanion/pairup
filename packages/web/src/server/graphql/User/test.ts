import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'

describe(`currentUser`, () => {
  it(`should return null when unauthenticated`, async () => {
    expect(
      await request(
        graphql`
          {
            currentUser {
              id
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
              id
              firstName
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
            "firstName": "Tester",
            "id": "test",
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
              id
              firstName
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
            "firstName": "Tester",
            "id": "test",
          },
        },
      }
    `)

    // Update name
    expect(
      await request(
        graphql`
          mutation updateUser($userId: String!) {
            updateUser(userId: $userId, firstName: "New name") {
              id
              firstName
            }
          }
        `,
        {
          context: {
            user: testData.users[0],
          },

          variables: {
            userId: testData.users[0].id,
          },
        }
      )
    ).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "updateUser": Object {
            "firstName": "New name",
            "id": "test",
          },
        },
      }
    `)

    // Updated name
    expect(
      await request(
        graphql`
          {
            currentUser {
              id
              firstName
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
            "firstName": "New name",
            "id": "test",
          },
        },
      }
    `)
  })
})
