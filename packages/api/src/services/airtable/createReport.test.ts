import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../../server'
import { createReport } from './createReport'

describe('Create Airtable Record', () => {
  it('should use airtable client to create a new record', async () => {
    const patchMock = jest.fn()

    jest.resetModules()
    jest.unmock('airtable')

    jest.doMock('airtable', () => {
      return () => {
        // @ts-ignore
        const record = {
          create() {
            return record
          },
        }
        return record
      }
    })

    const { createReport: mockedCreateReport } = require('./createReport')

    const res = (await mockedCreateReport(
      {},
      {
        report: {
          name: 'Elena',
          email: 'elena@test.com',
          description: '....',
          isAbuserPairer: false,
          abuseType: 'Something else',
        },
      },
      null as unknown as GraphQLContext,
      null as unknown as GraphQLResolveInfo
    )) as Awaited<ReturnType<typeof createReport>>

    expect(patchMock).toBeCalledWith(
      `drafts.${res?.success}`,
      expect.any(Function)
    )

    expect(res?.Error).toHaveLength(2)
    expect(res?.success).toBe(true)
  })

  it('should fail if name field is not completed', async () => {
    const res = await createReport(
      {},
      {
        report: {
          name: '',
          email: 'elena@test.com',
          description: '....',
          isAbuserPairer: false,
          abuseType: 'Something else',
        },
      },
      null as unknown as GraphQLContext,
      null as unknown as GraphQLResolveInfo
    )

    expect(res).toMatchInlineSnapshot()
  })
})
