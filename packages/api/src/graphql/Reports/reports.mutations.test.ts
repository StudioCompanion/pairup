import { PairUp } from '@pairup/shared/types'
import { request, graphql } from 'test/request'

describe('Reports Mutations', () => {
  describe('reportsSubmitAbuse', () => {
    const mutation = graphql`
      mutation ReportsSubmitAbuse($report: ReportAbuseInput!) {
        reportsSubmitAbuse(report: $report) {
          success
          UserInputError {
            message
            input
            UserInputErrorCodes
          }
        }
      }
    `
    it('should return a data object with success: true if creating the record was successful', async () => {
      expect(
        await request(mutation, {
          variables: {
            report: {
              name: 'Lilian',
              email: 'lilian@test.com',
              description: '....',
              isAbuserPairer: true,
              abuseType: PairUp.Abuse.PretendingToBeSomeone,
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "reportsSubmitAbuse": Object {
              "UserInputError": null,
              "success": true,
            },
          },
        }
      `)
    })
  })
})
