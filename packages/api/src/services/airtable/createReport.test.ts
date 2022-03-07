import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../../server'

describe('Create Airtable Record', () => {
  it('should use airtable client to create a new record', async () => {
    const mockCreate = jest.fn().mockImplementation((report) => ({
      ...report,
      getId: jest.fn(),
    }))

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

    await mockedCreateReport(
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
    )

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

  it('should send an email to the admin about the new report', async () => {
    const sendEmailWithTemplateMock = jest.fn()
    jest.resetModules()
    jest.unmock('postmark')

    jest.doMock('postmark', () => ({
      ServerClient: () => ({
        sendEmailWithTemplate: sendEmailWithTemplateMock,
      }),
    }))

    const { createReport: mockedCreateReport } = await require('./createReport')

    await mockedCreateReport(
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
    )

    expect(sendEmailWithTemplateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        To: process.env.POSTMARK_ADMIN_EMAIL,
        From: process.env.POSTMARK_FROM_EMAIL,
        TemplateId: Number(process.env.POSTMARK_TEMPLATE_ID_NEW_REPORT),
        TemplateModel: expect.any(Object),
      })
    )
  })
})
