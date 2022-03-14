import { rest } from 'msw'

export const airtableHandlers = [
  rest.post(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_REPORTS_ID}/Reports/`,
    (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          records: [
            {
              id: 'recXEqRmGFNYXmrJU',
            },
          ],
        })
      )
    }
  ),
]
