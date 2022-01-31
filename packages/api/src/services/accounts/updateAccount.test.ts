import { GraphQLResolveInfo } from 'graphql'
import { testData } from 'test/seed/data'

import { GraphQLContext } from '../../server'

import { prisma } from '../../db/prisma'

import { createAccessToken } from '../tokens/createAccessToken'

import { updateAccount } from './updateAccount'

describe('service updateAccount', () => {
  it('should change the password of a user', async () => {
    const password = 'DVUE8j=uQ;?>,6w%EOh8'

    /**
     * Check we can't create an accessToken first
     */
    expect(
      await createAccessToken(
        {},
        {
          email: testData.users[0].email,
          password,
        },
        null as unknown as GraphQLContext,
        null as unknown as GraphQLResolveInfo
      )
    ).toMatchInlineSnapshot(`
      Object {
        "UserAccessToken": null,
        "UserError": Array [
          Object {
            "errorCode": "NotFound",
            "input": "email",
            "message": "Email and Password combination does not match records",
          },
          Object {
            "errorCode": "NotFound",
            "input": "password",
            "message": "Email and Password combination does not match records",
          },
        ],
      }
    `)

    /**
     * Update the password
     */
    await updateAccount(
      {},
      {
        password,
      },
      {
        prisma,
        user: {
          userId: testData.users[0].userId,
        },
      },
      null as unknown as GraphQLResolveInfo
    )

    /**
     * Check we can now create an accessToken
     */
    expect(
      await createAccessToken(
        {},
        {
          email: testData.users[0].email,
          password,
        },
        null as unknown as GraphQLContext,
        null as unknown as GraphQLResolveInfo
      )
    ).toEqual(
      expect.objectContaining({
        UserAccessToken: {
          accessToken: expect.any(String),
          expiresAt: expect.any(String),
        },
        UserError: [],
      })
    )
  })
})
