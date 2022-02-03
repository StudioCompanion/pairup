import { GraphQLResolveInfo } from 'graphql'
import { passwords, testData } from 'test/seed/data'

import { GraphQLContext } from '../../server'

import { prisma } from '../../db/prisma'

import { createAccessToken } from '../tokens/createAccessToken'

import { updateAccount } from './updateAccount'
import { PAIRER_PROFILE_STATUS } from '@pairup/shared'

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
          expiresAt: expect.any(Date),
        },
        UserError: [],
      })
    )
  })

  it('should update the email of the user in the database', async () => {
    const email = 'dev@companion.studio'

    /**
     * Check we can't create an accessToken first
     */
    expect(
      await createAccessToken(
        {},
        {
          email,
          password: passwords[0].password,
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
        email,
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
          email,
          password: passwords[0].password,
        },
        null as unknown as GraphQLContext,
        null as unknown as GraphQLResolveInfo
      )
    ).toEqual(
      expect.objectContaining({
        UserAccessToken: {
          accessToken: expect.any(String),
          expiresAt: expect.any(Date),
        },
        UserError: [],
      })
    )
  })

  it('should update the email of the user on their Sanity profile & set the status to awaiting approval', async () => {
    const patchMock = jest.fn()
    const setMock = jest.fn()

    jest.resetModules()
    jest.unmock('@sanity/client')

    jest.doMock('@sanity/client', () => {
      return () => {
        // @ts-ignore
        const client = {
          transaction() {
            return client
          },
          createIfNotExists() {
            return client
          },
          patch: patchMock.mockImplementation(() => {
            return client
          }),
          commit() {
            return client
          },
          set: setMock.mockImplementation(() => {
            return client
          }),
          getDocument() {
            return false
          },
        }
        return client
      }
    })

    const { updateAccount: mockedUpdateAccount } = require('./updateAccount')

    const email = 'dev@companion.studio'

    /**
     * Update the password
     */
    await mockedUpdateAccount(
      {},
      {
        email,
      },
      {
        prisma,
        user: {
          userId: testData.users[0].userId,
        },
      },
      null as unknown as GraphQLResolveInfo
    )

    const id = `drafts.${testData.users[0].userId}`

    expect(patchMock).toBeCalledWith(id)

    expect(setMock).toBeCalledWith(
      expect.objectContaining({
        email,
        _id: id,
        _type: 'pairerProfile',
        status: PAIRER_PROFILE_STATUS.AWAITING_APPROVAL,
        lastModifiedAt: expect.any(String),
      })
    )
  })

  it.todo(
    'should send a SuperUser an email when someone has made changes to their profile'
  )

  it.todo(
    'should not require approval for availability updates and publish a new version of their profile'
  )
})
