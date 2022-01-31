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
    ).toMatchInlineSnapshot(`
      Object {
        "UserAccessToken": Object {
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE2NDM2NTI1NzAsImV4cCI6MTY0NDI1NzM3MH0.gfvzCCrIekf67DEL3lomOded9SnobyGC-GZ2GaPIT6M",
          "expiresAt": 2022-02-07T18:09:30.652Z,
        },
        "UserError": Array [],
      }
    `)
  })
})
