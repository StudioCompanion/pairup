import { graphql as executeGraphQL, Source } from 'graphql'
import { oneLine } from 'common-tags'
import { PrismaClient } from '@prisma/client'

import { schema } from '@pairup/api/src/graphql/schema'
import { prisma } from '@pairup/api/src/db/prisma'

interface Options {
  context?: {
    prisma?: PrismaClient
  }
  variables?: Record<string, unknown>
}

/**
 * Execute a GraphQL query for unit testing
 *
 * @example
 * ```ts
 * expect(await request(graphql`{ currentUser { id } }`)).toMatchSnapshot()
 * ```
 * ```ts
 * // To authenticate a user:
 * expect(await request(graphql`{ currentUser { id } }`, {
 *   context: {
 *     user: testData.users[0]
 *   }
 * })).toMatchSnapshot()
 * ```
 */
export const request = (
  query: string | Source,
  { context, variables }: Options = {}
) => {
  return executeGraphQL(
    schema,
    query,
    undefined,
    { prisma, user: { userId: null }, ...context },
    variables
  )
}

/**
 * No-op graphql tagged template literal for tests to trigger Prettier's code formatted and VSCode's syntax highlighting
 * @example
 * ```ts
 * expect(await request(graphql`{ currentUser { id } }`)).toMatchSnapshot()
 * ```
 */
export const graphql = oneLine
