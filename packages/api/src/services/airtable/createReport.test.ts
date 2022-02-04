import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../../server'
import { createReport } from './createReport'

describe('Create Airtable Record', () => {
  it('should use airtable client to create a new record', async () => {
    const mockCreate = jest.fn()

    jest.resetModules()
    jest.unmock('airtable')

    jest.doMock('airtable', () => {
      return class MockedAirtableClass {
        base() {
          return () => ({
            create: mockCreate,
          })
        }
      }
    })

    const { createReport: mockedCreateReport } = await require('./createReport')

    ;(await mockedCreateReport(
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

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        Name: 'Elena',
        Email: 'elena@test.com',
        'Incident description': '....',
        'Nature of the abuse': 'Something else',
        'Is the abuser a Pairer?': false,
      })
    )
  })
})
