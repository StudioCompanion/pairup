import { testData } from 'test/seed/data'
import { request, graphql } from 'test/request'
import { ReportAbuseInputType } from './types'


describe('Reports Mutations', () => {
    describe('createAbuseReport', () =>{
        const mutation = graphql`
        mutation CreateAbuseReport(
            $report: ReportAbuseInputType
        ) {
            createAbuseReport(report: {name, email, description, isAbuserPairer, abuseType}) {
                Report {
                    name
                    email
                    description
                    isAbuserPairer
                    abuseType
                }
                Error {
                    errorCode
                    input
                    message
                }
            }
        }
        `
    })
})