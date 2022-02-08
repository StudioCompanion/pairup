import { PairUp } from '@pairup/shared/types'
import { request, graphql } from 'test/request'

describe('Reports Mutations', () => {
  describe('reportsSubmitAbuse', () => {
    const mutation = graphql`
      mutation ReportsSubmitAbuse($report: ReportAbuseInput!) {
        reportsSubmitAbuse(report: $report) {
          success
          ReportInputError {
            message
            input
            errorCode
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
              "ReportInputError": Array [],
              "success": true,
            },
          },
        }
      `)
    })

    it('should prevent submission and produce correct GraphQL and Zod errors when email is missing', async () => {
      expect(
        await request(mutation, {
          variables: {
            report: {
              name: 'Lilian',
              email: '',
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
              "ReportInputError": Array [
                Object {
                  "errorCode": "INVALID",
                  "input": "email",
                  "message": "Invalid email address provided",
                },
                Object {
                  "errorCode": "INVALID",
                  "input": "email",
                  "message": "Should be at least 1 characters",
                },
              ],
              "success": false,
            },
          },
        }
      `)
    })

    it('should prevent submission and produce error when the abuse type is not one of the provided options in the enum', async () => {
      expect(
        await request(mutation, {
          variables: {
            report: {
              name: 'Lilian',
              email: 'lilian@test.com',
              description: '....',
              isAbuserPairer: true,
              abuseType: 'Too many emails!',
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "errors": Array [
            [GraphQLError: Variable "$report" got invalid value "Too many emails!" at "report.abuseType"; Value "Too many emails!" does not exist in "Abuse" enum.],
          ],
        }
      `)
    })
  })
})
