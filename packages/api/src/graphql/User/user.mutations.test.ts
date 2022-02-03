import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'

describe('User Mutations', () => {
  describe('userCreateAccount', () => {
    const mutation = graphql`
      mutation UserCreateAccount(
        $email: String!
        $password: String!
        $profile: UserProfileInput!
      ) {
        userCreateAccount(
          email: $email
          password: $password
          profile: $profile
        ) {
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
            profile: {
              firstName: 'Josh',
              lastName: 'Ellis',
              bio: 'Josh is a developer',
              disciplines: ['UX', 'VR'],
              timezone: 'GMT +1',
              availability: {
                monday: [
                  {
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
              },
              jobTitle: 'Developer',
            },
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
            profile: {
              firstName: 'Josh',
              lastName: 'Ellis',
              bio: 'Josh is a developer',
              disciplines: ['UX', 'VR'],
              timezone: 'GMT +1',
              availability: {
                monday: [
                  {
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
              },
              jobTitle: 'Developer',
            },
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
            profile: {
              firstName: 'Josh',
              lastName: 'Ellis',
              bio: 'Josh is a developer',
              disciplines: ['UX', 'VR'],
              timezone: 'GMT +1',
              availability: {
                monday: [
                  {
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
              },
              jobTitle: 'Developer',
            },
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
            profile: {
              firstName: 'Josh',
              lastName: 'Ellis',
              bio: 'Josh is a developer',
              disciplines: ['UX', 'VR'],
              timezone: 'GMT +1',
              availability: {
                monday: [
                  {
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
              },
              jobTitle: 'Developer',
            },
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

    it('should return a UserErrors list with both inputs listed if neither are correct & and profile is missing', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'josh',
            password: 'hello',
            profile: {
              firstName: 'Josh',
              lastName: 'Ellis',
              bio: 'Josh is a developer',
              disciplines: ['UX', 'VR'],
              timezone: 'GMT +1',
              availability: {
                monday: [
                  {
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
              },
              jobTitle: 'Developer',
            },
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

    it('should return a UserError if vital information is missing from the profile', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'josh@gmail.com',
            password: 'DVUE8j=uQ;?>,6w%EOh8',
            profile: {
              availability: {},
            },
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
                  "input": "firstName",
                  "message": "Required",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "lastName",
                  "message": "Required",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "jobTitle",
                  "message": "Required",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "bio",
                  "message": "Required",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "disciplines",
                  "message": "You have to select at least one discipline",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "timezone",
                  "message": "Required",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "availability",
                  "message": "Availability must have at least one day added",
                },
              ],
            },
          },
        }
      `)
    })

    it('should return a UserError if days are specified in availability yet include no times', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'josh@gmail.com',
            password: 'DVUE8j=uQ;?>,6w%EOh8',
            profile: {
              firstName: 'Josh',
              lastName: 'Ellis',
              jobTitle: 'Developer',
              bio: 'Josh is a developer',
              disciplines: ['UX', 'VR'],
              timezone: 'GMT +1',
              availability: {
                monday: [],
                tuesday: [],
                friday: [
                  {
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
              },
            },
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
                  "input": "monday",
                  "message": "Should have at least 1 items",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "tuesday",
                  "message": "Should have at least 1 items",
                },
              ],
            },
          },
        }
      `)
    })
  })

  describe('userCreateAccessToken', () => {
    const accountDetails = {
      email: 'dev@companion.studio',
      password: 'DVUE8j=uQ;?>,6w%EOh8',
    }

    const mutation = graphql`
      mutation userCreateAccessToken($email: String!, $password: String!) {
        userCreateAccessToken(email: $email, password: $password) {
          UserAccessToken {
            accessToken
            expiresAt
          }
          UserError {
            message
            input
            errorCode
          }
        }
      }
    `

    beforeEach(async () => {
      /**
       * Add the user to the DB with the PW & email
       */
      await request(
        graphql`
          mutation UserCreateAccount(
            $email: String!
            $password: String!
            $profile: UserProfileInput!
          ) {
            userCreateAccount(
              email: $email
              password: $password
              profile: $profile
            ) {
              User {
                email
              }
            }
          }
        `,
        {
          variables: {
            ...accountDetails,
            profile: {
              firstName: 'Josh',
              lastName: 'Ellis',
              bio: 'Josh is a developer',
              disciplines: ['UX', 'VR'],
              timezone: 'GMT +1',
              availability: {
                monday: [
                  {
                    startTime: '08:00',
                    endTime: '12:00',
                  },
                ],
              },
              jobTitle: 'Developer',
            },
          },
        }
      )
    })

    it('should return an access token if successful', async () => {
      expect(
        await request(mutation, {
          variables: accountDetails,
        })
      ).toEqual(
        expect.objectContaining({
          data: {
            userCreateAccessToken: {
              UserAccessToken: {
                accessToken: expect.any(String),
                expiresAt: expect.any(String),
              },
              UserError: [],
            },
          },
        })
      )
    })

    it('should return an error if the password doesnt match', async () => {
      expect(
        await request(mutation, {
          variables: {
            ...accountDetails,
            password: 'DVUE8j=uQ;?>,6w%EOh8!!',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccessToken": Object {
              "UserAccessToken": null,
              "UserError": Array [
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "email",
                  "message": "Email and Password combination does not match records",
                },
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "password",
                  "message": "Email and Password combination does not match records",
                },
              ],
            },
          },
        }
      `)
    })

    it('should return an error if the email doesnt match', async () => {
      expect(
        await request(mutation, {
          variables: {
            ...accountDetails,
            email: 'devs@companion.studio',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccessToken": Object {
              "UserAccessToken": null,
              "UserError": Array [
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "email",
                  "message": "Email and Password combination does not match records",
                },
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "password",
                  "message": "Email and Password combination does not match records",
                },
              ],
            },
          },
        }
      `)
    })

    it('should return an error if the email or password do not pass validation', async () => {
      expect(
        await request(mutation, {
          variables: {
            password: '1234',
            email: 'devs@gma',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userCreateAccessToken": Object {
              "UserAccessToken": null,
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

  describe('userUpdateAccount', () => {
    it('should throw if no user is signed in', async () => {
      expect(
        await request(
          graphql`
            mutation UserUpdateAccount($email: String) {
              userUpdateAccount(email: $email) {
                UserAccessToken {
                  accessToken
                }
              }
            }
          `,
          {
            variables: {
              email: 'dev@companion.studio',
            },
          }
        )
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userUpdateAccount": null,
          },
          "errors": Array [
            [GraphQLError: User must be logged in],
          ],
        }
      `)
    })

    it('should throw if no email, password or profile has been passed', async () => {
      expect(
        await request(
          graphql`
            mutation UserUpdateAccount {
              userUpdateAccount {
                UserAccessToken {
                  accessToken
                }
              }
            }
          `,
          {
            context: {
              user: {
                userId: testData.users[0].userId,
              },
            },
          }
        )
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userUpdateAccount": null,
          },
          "errors": Array [
            [GraphQLError: Mutation userUpdateAccount requires at least one parameter],
          ],
        }
      `)
    })

    describe('changing password', () => {
      it('should return an access code if the new password is an acceptable password', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($password: String) {
                userUpdateAccount(password: $password) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                password: 'DVUE8j=uQ;?>,6w%EOh8',
              },
              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toEqual(
          expect.objectContaining({
            data: {
              userUpdateAccount: {
                UserAccessToken: {
                  accessToken: expect.any(String),
                  expiresAt: expect.any(String),
                },
                UserError: [],
              },
            },
          })
        )
      })

      it('should return UserError if the password does not meet requirements', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($password: String) {
                userUpdateAccount(password: $password) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                password: 'applepie',
              },
              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "userUpdateAccount": Object {
                "UserAccessToken": null,
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

      it('should return UserError if the new password is the same as the old password', async () => {
        await request(
          graphql`
            mutation UserUpdateAccount($password: String) {
              userUpdateAccount(password: $password) {
                UserAccessToken {
                  accessToken
                  expiresAt
                }
                UserError {
                  message
                  input
                  errorCode
                }
              }
            }
          `,
          {
            variables: {
              password: 'DVUE8j=uQ;?>,6w%EOh8',
            },
            context: {
              user: {
                userId: testData.users[0].userId,
              },
            },
          }
        )

        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($password: String) {
                userUpdateAccount(password: $password) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                password: 'DVUE8j=uQ;?>,6w%EOh8',
              },
              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "userUpdateAccount": Object {
                "UserAccessToken": null,
                "UserError": Array [
                  Object {
                    "errorCode": "INVALID",
                    "input": "password",
                    "message": "New password cannot be the same as old password",
                  },
                ],
              },
            },
          }
        `)
      })
    })

    describe('updating email', () => {
      it('should return a new accessToken if successful', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($email: String) {
                userUpdateAccount(email: $email) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                email: 'amazinguser@companion.studio',
              },
              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toEqual(
          expect.objectContaining({
            data: {
              userUpdateAccount: {
                UserAccessToken: {
                  accessToken: expect.any(String),
                  expiresAt: expect.any(String),
                },
                UserError: [],
              },
            },
          })
        )
      })

      it('should return UserError if the email does not meet requirements', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($email: String) {
                userUpdateAccount(email: $email) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                email: 'myemail',
              },

              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "userUpdateAccount": Object {
                "UserAccessToken": null,
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

      it('should return UserError if the new email is the same as the old email', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($email: String) {
                userUpdateAccount(email: $email) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                email: testData.users[0].email,
              },

              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "userUpdateAccount": Object {
                "UserAccessToken": null,
                "UserError": Array [
                  Object {
                    "errorCode": "INVALID",
                    "input": "email",
                    "message": "New email cannot be the same as old email",
                  },
                ],
              },
            },
          }
        `)
      })
    })

    describe('updating profile', () => {
      it('should return a new accessToken if successful', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($profile: UserProfileInput) {
                userUpdateAccount(profile: $profile) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                profile: {
                  firstName: 'Mr',
                  lastName: 'Pickles',
                  availability: {
                    tuesday: [{ startTime: '08:00', endTime: '12:00' }],
                  },
                },
              },
              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toEqual(
          expect.objectContaining({
            data: {
              userUpdateAccount: {
                UserAccessToken: {
                  accessToken: expect.any(String),
                  expiresAt: expect.any(String),
                },
                UserError: [],
              },
            },
          })
        )
      })

      it('should return UserError when fields are not correct', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($profile: UserProfileInput) {
                userUpdateAccount(profile: $profile) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserError {
                    message
                    input
                    errorCode
                  }
                }
              }
            `,
            {
              variables: {
                profile: {
                  // should not pass an empty string
                  firstName: '',
                  jobTitle: '',
                  availability: {
                    // should pass an empty array
                    tuesday: [],
                  },
                  // should not pass an empty array
                  disciplines: [],
                },
              },

              context: {
                user: {
                  userId: testData.users[0].userId,
                },
              },
            }
          )
        ).toMatchInlineSnapshot(`
          Object {
            "data": Object {
              "userUpdateAccount": Object {
                "UserAccessToken": null,
                "UserError": Array [
                  Object {
                    "errorCode": "INVALID",
                    "input": "firstName",
                    "message": "First name is required",
                  },
                  Object {
                    "errorCode": "INVALID",
                    "input": "jobTitle",
                    "message": "Your job title is required",
                  },
                  Object {
                    "errorCode": "INVALID",
                    "input": "disciplines",
                    "message": "Should have at least 1 items",
                  },
                ],
              },
            },
          }
        `)
      })
    })

    it('should return an accessToken when changing more than one parameter at a time', async () => {
      expect(
        await request(
          graphql`
            mutation UserUpdateAccount($password: String) {
              userUpdateAccount(password: $password) {
                UserAccessToken {
                  accessToken
                  expiresAt
                }
                UserError {
                  message
                  input
                  errorCode
                }
              }
            }
          `,
          {
            variables: {
              email: 'amazinguser@companion.studio',
              password: 'DVUE8j=uQ;?>,6w%EOh8',
              profile: {
                firstName: 'User',
                lastName: 'fantastic',
              },
            },
            context: {
              user: {
                userId: testData.users[0].userId,
              },
            },
          }
        )
      ).toEqual(
        expect.objectContaining({
          data: {
            userUpdateAccount: {
              UserAccessToken: {
                accessToken: expect.any(String),
                expiresAt: expect.any(String),
              },
              UserError: [],
            },
          },
        })
      )
    })
  })
})
