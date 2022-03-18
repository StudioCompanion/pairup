import { rest } from 'msw'
export const sanityHandlers = [
  rest.post(
    `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2022-01-25/data/mutate/${process.env.SANITY_DATASET}`,
    (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          results: [],
        })
      )
    }
  ),
  rest.post(
    `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2022-01-25/data/mutate/${process.env.SANITY_DATASET}`,
    (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          results: [],
        })
      )
    }
  ),
  rest.get(
    `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2022-01-25/data/doc/${process.env.SANITY_DATASET}/:id`,
    (_, res, ctx) => {
      return res(ctx.status(200), ctx.json({ result: {} }))
    }
  ),
  rest.get(
    `https://${process.env.SANITY_PROJECT_ID}.apicdn.sanity.io/v2022-01-25/data/query/${process.env.SANITY_DATASET}`,
    (req, res, ctx) => {
      const query = req.url.searchParams.get('query')

      if (query === `*[_type == 'blacklistedEmails' && email == $email][0]`) {
        const email = req.url.searchParams.get('$email')

        if (email === '"test@testing.com"') {
          return res(ctx.status(200), ctx.json({ result: null }))
        } else {
          return res(
            ctx.status(200),
            ctx.json({
              result: {
                _createdAt: '2022-03-03T14:57:39Z',
                _id: '3f3f0d9f-ea5b-4e2b-8f29-f5fb69867f2d',
                _rev: 'SHN0P35ma3v0JGt27Wini3',
                _type: 'blacklistedEmails',
                _updatedAt: '2022-03-03T14:57:39Z',
                email: 'alex@test.com',
              },
            })
          )
        }
      }
    }
  ),
]
