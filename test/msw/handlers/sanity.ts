import { rest } from 'msw'

export const sanityHandlers = [
  rest.get(
    `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2022-01-25/data/doc/${process.env.SANITY_DATASET}/0c802d2c-a791-44d2-affb-82cc4181bb9c`,
    (_, res, ctx) => {
      return res(ctx.status(200), ctx.json({ result: true }))
    }
  ),
  rest.get(
    `https://${process.env.SANITY_PROJECT_ID}.apicdn.sanity.io/v2022-01-25/data/query/${process.env.SANITY_DATASET}`,
    (req, res, ctx) => {
      const search = req.url.searchParams.get('$email')

      //if we do not find the email in sanity
      if (search === '"test@testing.com"') {
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
  ),
]
