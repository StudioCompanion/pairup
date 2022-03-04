import { rest } from 'msw'
import { testData } from '../seed/data'

export const handlers = [
  rest.get(
    'https://uso4acwf.api.sanity.io/v2021-10-21/data/query/staging',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ result: {} })
        // ctx.json(testData.users[0].email)
      )
    }
  ),
]
