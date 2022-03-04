import { rest } from 'msw'
import { testData } from '../seed/data'

export const handlers = [
  rest.get(
    `https://${process.env.SANITY_PROJECT_ID}.apicdn.sanity.io/v2022-01-25/data/query/${process.env.SANITY_DATASET}`,
    (req, res, ctx) => {
      const search = req.url.searchParams.get('$email')

      console.log('search', search)

      //if we do not find the email in sanity
      if (search === '"test@testing.com"') {
        return res(ctx.status(200), ctx.json({ result: null }))
      } else {
        return res(ctx.status(200), ctx.json(testData.users[0].email))
      }
    }
  ),
]
