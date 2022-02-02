import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../../server'
import { createReport } from './createReport'

describe('Create Airtable Record', () => {
  it('should use airtable client to create a new record', async () => {
    const patchMock = jest.fn()

    jest.resetModules()
    jest.unmock('airtable')

    jest.doMock('airtable', () => {
      return () => {
        // @ts-ignore
        const record = {
          create() {
            return record
          },
        }
        return record
      }
    })

    const { createReport: mockedCreateReport } = require('./createReport')

    const res = (await mockedCreateReport(
      {},
      {
        report: {
          name: 'Elena',
          email: 'elena@test.com',
          description: '....',
          isAbuserPairer: false,
          abuseType: 'Something else',
        },
      },
      null as unknown as GraphQLContext,
      null as unknown as GraphQLResolveInfo
    )) as Awaited<ReturnType<typeof createReport>>

    expect(patchMock).toBeCalledWith(
      `drafts.${res?.success}`,
      expect.any(Function)
    )

    expect(res?.Error).toHaveLength(2)
    expect(res?.success).toBe(true)
  })

  it('should fail if name field is not completed', async () => {
    const res = await createReport(
      {},
      {
        report: {
          name: '',
          email: 'elena@test.com',
          description: '....',
          isAbuserPairer: false,
          abuseType: 'Something else',
        },
      },
      null as unknown as GraphQLContext,
      null as unknown as GraphQLResolveInfo
    )

    expect(res).toMatchInlineSnapshot(`
    {
        "errors": [
          {
            "message": "[\n  {\n    \"code\": \"too_small\",\n    \"minimum\": 1,\n    \"type\": \"string\",\n    \"inclusive\": true,\n    \"message\": \"Name is required\",\n    \"path\": [\n      \"name\"\n    ]\n  }\n]",
            "locations": [
              {
                "line": 2,
                "column": 3
              }
            ],
            "path": [
              "reportsSubmitAbuse"
            ],
            "extensions": {
              "code": "INTERNAL_SERVER_ERROR",
              "exception": {
                "issues": [
                  {
                    "code": "too_small",
                    "minimum": 1,
                    "type": "string",
                    "inclusive": true,
                    "message": "Name is required",
                    "path": [
                      "name"
                    ]
                  }
                ],
                "name": "ZodError",
                "stacktrace": [
                  "ZodError: [",
                  "  {",
                  "    \"code\": \"too_small\",",
                  "    \"minimum\": 1,",
                  "    \"type\": \"string\",",
                  "    \"inclusive\": true,",
                  "    \"message\": \"Name is required\",",
                  "    \"path\": [",
                  "      \"name\"",
                  "    ]",
                  "  }",
                  "]",
                  "    at new ZodError (/Users/elena/Desktop/pairup/node_modules/zod/src/ZodError.ts:140:5)",
                  "    at handleResult (/Users/elena/Desktop/pairup/node_modules/zod/src/types.ts:72:19)",
                  "    at ZodObject.ZodType.safeParse (/Users/elena/Desktop/pairup/node_modules/zod/src/types.ts:184:12)",
                  "    at ZodObject.ZodType.parse (/Users/elena/Desktop/pairup/node_modules/zod/src/types.ts:162:25)",
                  "    at /Users/elena/Desktop/pairup/packages/api/src/services/airtable/createReport.ts:49:23",
                  "    at Generator.next (<anonymous>)",
                  "    at /Users/elena/Desktop/pairup/packages/api/src/services/airtable/createReport.ts:8:71",
                  "    at new Promise (<anonymous>)",
                  "    at __awaiter (/Users/elena/Desktop/pairup/packages/api/src/services/airtable/createReport.ts:4:12)",
                  "    at createReport (/Users/elena/Desktop/pairup/packages/api/src/services/airtable/createReport.ts:47:35)"
                ]
              }
            }
          }
        ],
        "data": {
          "reportsSubmitAbuse": null
        }
      }
    `)
  })
})
