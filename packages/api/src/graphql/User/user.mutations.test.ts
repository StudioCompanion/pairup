import { sign } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'

import { createToken } from '../../helpers/tokens'
import { prisma } from '../../db/prisma'

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
          UserInputError {
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
              "UserInputError": null,
            },
          },
        }
      `)
    })

    it('should return a UserInputErrors list if the password is not strong enough', async () => {
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
              "UserInputError": Array [
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

    it('should return an UserInputErrors list if the email is not an email', async () => {
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
              "UserInputError": Array [
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

    it('should return an UserInputErrors list if the email has already been used', async () => {
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
              "UserInputError": Array [
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

    it('should return an UserInputErrors list with both inputs listed if neither are correct & and profile is missing', async () => {
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
              "UserInputError": Array [
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

    it('should return an UserInputError if vital information is missing from the profile', async () => {
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
              "UserInputError": Array [
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

    it('should return an UserInputError if days are specified in availability yet include no times', async () => {
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
              "UserInputError": Array [
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
          UserInputError {
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
              UserInputError: [],
            },
          },
        })
      )
    })

    it('should return an UserInputError if the password doesnt match', async () => {
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
              "UserInputError": Array [
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

    it('should return an UserInputError if the email doesnt match', async () => {
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
              "UserInputError": Array [
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

    it('should return an UserInputError if the email or password do not pass validation', async () => {
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
              "UserInputError": Array [
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
                  UserInputError {
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
                UserInputError: [],
              },
            },
          })
        )
      })

      it('should return UserInputError if the password does not meet requirements', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($password: String) {
                userUpdateAccount(password: $password) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserInputError {
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
                "UserInputError": Array [
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

      it('should return UserInputError if the new password is the same as the old password', async () => {
        await request(
          graphql`
            mutation UserUpdateAccount($password: String) {
              userUpdateAccount(password: $password) {
                UserAccessToken {
                  accessToken
                  expiresAt
                }
                UserInputError {
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
                  UserInputError {
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
                "UserInputError": Array [
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
                  UserInputError {
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
                UserInputError: [],
              },
            },
          })
        )
      })

      it('should return UserInputError if the email does not meet requirements', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($email: String) {
                userUpdateAccount(email: $email) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserInputError {
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
                "UserInputError": Array [
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

      it('should return UserInputError if the new email is the same as the old email', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($email: String) {
                userUpdateAccount(email: $email) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserInputError {
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
                "UserInputError": Array [
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
                  UserInputError {
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
                UserInputError: [],
              },
            },
          })
        )
      })

      it('should return UserInputError when fields are not correct', async () => {
        expect(
          await request(
            graphql`
              mutation UserUpdateAccount($profile: UserProfileInput) {
                userUpdateAccount(profile: $profile) {
                  UserAccessToken {
                    accessToken
                    expiresAt
                  }
                  UserInputError {
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
                "UserInputError": Array [
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
                UserInputError {
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
              UserInputError: [],
            },
          },
        })
      )
    })
  })

  describe('userRecover', () => {
    const mutation = graphql`
      mutation UserRecover($email: String!) {
        userRecover(email: $email) {
          success
          UserInputError {
            errorCode
            message
            input
          }
        }
      }
    `

    it('should return successfully if the email exists in the database', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: testData.users[0].email,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userRecover": Object {
              "UserInputError": Array [],
              "success": true,
            },
          },
        }
      `)
    })

    it('should return successfully if the email is not in the database', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'awesomeperson@gmail.com',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userRecover": Object {
              "UserInputError": Array [],
              "success": true,
            },
          },
        }
      `)
    })

    it('should throw if the email is not actually an email', async () => {
      expect(
        await request(mutation, {
          variables: {
            email: 'apples',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userRecover": Object {
              "UserInputError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "email",
                  "message": "Invalid email address provided",
                },
              ],
              "success": false,
            },
          },
        }
      `)
    })
  })

  describe('userReset', () => {
    const mutation = graphql`
      mutation UserReset($password: String!, $resetToken: String!) {
        userReset(password: $password, resetToken: $resetToken) {
          User {
            userId
            email
            role
          }
          UserAccessToken {
            accessToken
            expiresAt
          }
          UserInputError {
            message
            input
            errorCode
          }
        }
      }
    `

    let resetToken: string

    beforeEach(async () => {
      const { userId, email, personalKey } = testData.users[0]

      /**
       * Create a valid reset token
       */
      resetToken = createToken(
        {
          resetUserId: userId,
        },
        personalKey,
        {
          expiresIn: '1d',
        }
      )

      /**
       * Append it to the user entry
       */
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          resetToken,
        },
      })
    })

    it('should return the User, UserAccessToken and no UserError if successful', async () => {
      expect(
        await request(mutation, {
          variables: {
            password: 'J(dOKa98Kk>f]N($6Jq?',
            resetToken,
          },
        })
      ).toEqual({
        data: {
          userReset: {
            User: {
              email: testData.users[0].email,
              role: 'PAIRER',
              userId: expect.any(String),
            },
            UserAccessToken: {
              accessToken: expect.any(String),
              expiresAt: expect.any(String),
            },
            UserInputError: [],
          },
        },
      })
    })

    it('should throw if the token is not valid', async () => {
      expect(
        await request(mutation, {
          variables: {
            password: 'J(dOKa98Kk>f]N($6Jq?',
            resetToken: 'hello',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userReset": null,
          },
          "errors": Array [
            [GraphQLError: jwt malformed],
          ],
        }
      `)
    })

    it('should throw if the token was not signed with our secret', async () => {
      const token = sign(
        {
          resetUserId: testData.users[0].userId,
        },
        'SUPER_SECRET_KEY',
        {
          expiresIn: '7d',
        }
      )

      expect(
        await request(mutation, {
          variables: {
            password: 'J(dOKa98Kk>f]N($6Jq?',
            resetToken: token,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userReset": null,
          },
          "errors": Array [
            [GraphQLError: invalid signature],
          ],
        }
      `)
    })

    it('should return an error if the password is not valid', async () => {
      expect(
        await request(mutation, {
          variables: {
            password: 'apples',
            resetToken,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userReset": Object {
              "User": null,
              "UserAccessToken": null,
              "UserInputError": Array [
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

    it('should return an error if the user cannot be found', async () => {
      const token = createToken(
        {
          resetUserId: '123',
        },
        'banana',
        {
          expiresIn: '7d',
        }
      )

      expect(
        await request(mutation, {
          variables: {
            password: 'J(dOKa98Kk>f]N($6Jq?',
            resetToken: token,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userReset": Object {
              "User": null,
              "UserAccessToken": null,
              "UserInputError": Array [
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "resetToken",
                  "message": "No user found using the reset token provided",
                },
              ],
            },
          },
        }
      `)
    })

    it('should reutrn an error if the resetToken does not match that in the DB', async () => {
      const token = createToken(
        {
          resetUserId: testData.users[0].userId,
        },
        testData.users[0].personalKey,
        {
          expiresIn: '7d',
        }
      )

      expect(
        await request(mutation, {
          variables: {
            password: 'J(dOKa98Kk>f]N($6Jq?',
            resetToken: token,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userReset": Object {
              "User": null,
              "UserAccessToken": null,
              "UserInputError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "resetToken",
                  "message": "Invalid resetToken provided",
                },
              ],
            },
          },
        }
      `)
    })

    it('should not let me use the same code twice', async () => {
      expect(
        await request(mutation, {
          variables: {
            password: 'J(dOKa98Kk>f]N($6Jq?',
            resetToken,
          },
        })
      ).toEqual({
        data: {
          userReset: {
            User: {
              email: testData.users[0].email,
              role: 'PAIRER',
              userId: expect.any(String),
            },
            UserAccessToken: {
              accessToken: expect.any(String),
              expiresAt: expect.any(String),
            },
            UserInputError: [],
          },
        },
      })

      expect(
        await request(mutation, {
          variables: {
            password: 'J(dOKa98Kk>f]N($6Jq?',
            resetToken,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userReset": null,
          },
          "errors": Array [
            [GraphQLError: invalid signature],
          ],
        }
      `)
    })
  })

  describe('userRefreshAccessToken', () => {
    const mutation = graphql`
      mutation UserRefreshAccessToken($accessToken: String!) {
        userRefreshAccessToken(accessToken: $accessToken) {
          UserAccessToken {
            accessToken
            expiresAt
          }
          UserInputError {
            message
            input
            errorCode
          }
        }
      }
    `

    it('should return a new token if the current token has not expired', async () => {
      const token = createToken(
        {
          userId: testData.users[0].userId,
        },
        testData.users[0].personalKey,
        {
          expiresIn: '7d',
        }
      )

      const res = await request(mutation, {
        variables: {
          accessToken: token,
        },
      })

      expect(res).toEqual(
        expect.objectContaining({
          data: {
            userRefreshAccessToken: {
              UserAccessToken: {
                accessToken: expect.any(String),
                expiresAt: expect.any(String),
              },
              UserInputError: [],
            },
          },
        })
      )
    })

    it('should return a new token if the current token has expired', async () => {
      const token = createToken(
        {
          userId: testData.users[0].userId,
          iat: Math.floor(Date.now() / 1000) - 4,
        },
        testData.users[0].personalKey,
        {
          expiresIn: '3000',
        }
      )

      const res = await request(mutation, {
        variables: {
          accessToken: token,
        },
      })

      expect(res).toEqual(
        expect.objectContaining({
          data: {
            userRefreshAccessToken: {
              UserAccessToken: {
                accessToken: expect.any(String),
                expiresAt: expect.any(String),
              },
              UserInputError: [],
            },
          },
        })
      )
    })

    it('should not reutrn a new token if the current token is not valid', async () => {
      expect(
        await request(mutation, {
          variables: {
            accessToken: 'hello',
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userRefreshAccessToken": null,
          },
          "errors": Array [
            [GraphQLError: jwt malformed],
          ],
        }
      `)
    })

    it('should not return a new token if the current token was not signed by our app', async () => {
      const token = sign(
        {
          userId: testData.users[0].userId,
        },
        'apples',
        {
          expiresIn: '7d',
        }
      )
      expect(
        await request(mutation, {
          variables: {
            accessToken: token,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userRefreshAccessToken": null,
          },
          "errors": Array [
            [GraphQLError: invalid signature],
          ],
        }
      `)
    })

    it('should not return a new token if the current token does not contain a valid user', async () => {
      const token = sign(
        {
          userId: '1234',
        },
        testData.users[0].personalKey,
        {
          expiresIn: '7d',
        }
      )

      expect(
        await request(mutation, {
          variables: {
            accessToken: token,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userRefreshAccessToken": Object {
              "UserAccessToken": null,
              "UserInputError": Array [
                Object {
                  "errorCode": "NOT_FOUND",
                  "input": "accessToken",
                  "message": "No user found using the token provided",
                },
              ],
            },
          },
        }
      `)
    })

    it('should not return a new token if the user has changed their personal key', async () => {
      const token = sign(
        {
          userId: testData.users[0].userId,
        },
        testData.users[0].personalKey,
        {
          expiresIn: '7d',
        }
      )

      const personalKey = await bcrypt.genSalt(6)

      await prisma.user.update({
        where: {
          userId: testData.users[0].userId,
        },
        data: {
          personalKey,
        },
      })

      expect(
        await request(mutation, {
          variables: {
            accessToken: token,
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "userRefreshAccessToken": null,
          },
          "errors": Array [
            [GraphQLError: invalid signature],
          ],
        }
      `)
    })
  })
})
