import { graphql, request } from 'test/request'

describe('session mutations', () => {
  describe('session create', () => {
    const mutation = graphql`
      mutation SessionCreate(
        $pairerDetails: SessionCreatePairerDetails!
        $paireeDetails: SessionCreatePaireeDetails!
      ) {
        sessionCreate(
          pairerDetails: $pairerDetails
          paireeDetails: $paireeDetails
        ) {
          Session {
            id
          }
          SessionInputError {
            message
            errorCode
            input
          }
        }
      }
    `

    it('should return true if the session has been made', async () => {
      expect(await request(mutation)).toMatchInlineSnapshot()
    })
  })
})
