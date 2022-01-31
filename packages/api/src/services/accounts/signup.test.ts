import { GraphQLResolveInfo } from 'graphql'

import { prisma } from '../../db/prisma'

import { signup } from './signup'

describe('service signup', () => {
  it('should fail if email or password is not the correct format', async () => {
    const res = await signup(
      {},
      {
        email: 'hello',
        password: '1234',
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
      {
        prisma,
        user: {
          userId: null,
        },
      },
      null as unknown as GraphQLResolveInfo
    )
    expect(res).toMatchInlineSnapshot(`
      Object {
        "User": null,
        "UserError": Array [
          Object {
            "errorCode": "Invalid",
            "input": "email",
            "message": "Invalid email address provided",
          },
          Object {
            "errorCode": "Invalid",
            "input": "password",
            "message": "Password must be at least 8 characters long, contain 1 special character, 1 number, 1 capital and 1 lowercase letter",
          },
        ],
      }
    `)
    expect(res?.UserError).toHaveLength(2)
    expect(res?.User).toBe(null)
  })

  it('should fail if profile is not the correct format', async () => {
    const res = await signup(
      {},
      {
        email: 'test@gmail.com',
        password: 'DVUE8j=uQ;?>,6w%EOh8',
        profile: {
          firstName: '',
          lastName: '',
          bio: '',
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
          jobTitle: '',
        },
      },
      {
        prisma,
        user: {
          userId: null,
        },
      },
      null as unknown as GraphQLResolveInfo
    )

    expect(res).toMatchInlineSnapshot(`
      Object {
        "User": null,
        "UserError": Array [
          Object {
            "errorCode": "Invalid",
            "input": "firstName",
            "message": "First name is required",
          },
          Object {
            "errorCode": "Invalid",
            "input": "lastName",
            "message": "Last name is required",
          },
          Object {
            "errorCode": "Invalid",
            "input": "jobTitle",
            "message": "Your job title is required",
          },
          Object {
            "errorCode": "Invalid",
            "input": "bio",
            "message": "Your bio is required",
          },
        ],
      }
    `)

    expect(res?.User).toBe(null)
    expect(res?.UserError).toHaveLength(4)
  })

  it('should use the sanity client to create a pairer profile', async () => {
    const patchMock = jest.fn()

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
          getDocument() {
            return false
          },
        }
        return client
      }
    })

    const { signup: mockedSignup } = require('./signup')

    const res = (await mockedSignup(
      {},
      {
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
      {
        prisma,
        user: {
          userId: null,
        },
      },
      null as unknown as GraphQLResolveInfo
    )) as Awaited<ReturnType<typeof signup>>

    expect(patchMock).toBeCalledWith(
      `drafts.${res?.User?.userId}`,
      expect.any(Function)
    )
  })

  it('should use the postmark server client to send a verification email & send a new user email', async () => {
    const sendEmailWithTemplateMock = jest.fn()
    jest.resetModules()
    jest.unmock('postmark')

    jest.doMock('postmark', () => ({
      ServerClient: () => ({
        sendEmailWithTemplate: sendEmailWithTemplateMock,
      }),
    }))

    const { signup: mockedSignup } = require('./signup')

    ;(await mockedSignup(
      {},
      {
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
      {
        prisma,
        user: {
          userId: null,
        },
      },
      null as unknown as GraphQLResolveInfo
    )) as Awaited<ReturnType<typeof signup>>

    expect(sendEmailWithTemplateMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        To: 'josh@gmail.com',
        From: process.env.POSTMARK_FROM_EMAIL,
        TemplateId: Number(process.env.POSTMARK_TEMPLATE_ID_VERIFY),
        TemplateModel: expect.any(Object),
      })
    )

    expect(sendEmailWithTemplateMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        To: process.env.POSTMARK_ADMIN_EMAIL,
        From: process.env.POSTMARK_FROM_EMAIL,
        TemplateId: Number(process.env.POSTMARK_TEMPLATE_NEW_USER),
        TemplateModel: expect.any(Object),
      })
    )
  })
})
