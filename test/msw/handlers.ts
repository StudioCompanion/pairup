import { rest } from 'msw'
import { testData } from '../seed/data'

export const handlers = [
  rest.get(
    `https://${process.env.SANITY_PROJECT_ID}.apicdn.sanity.io/v2022-01-25/data/query/${process.env.SANITY_DATASET}`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ result: {} }))
    }
  ),
]
