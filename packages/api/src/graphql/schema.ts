import { makeSchema } from 'nexus'
import path from 'path'
import User from './User'
import Reports from './Reports'

// Only generate in development or when the yarn run generate:nexus command is run
// This fixes deployment on Netlify, otherwise you'll run into an EROFS error during building
const shouldGenerateArtifacts =
  process.env.NODE_ENV === 'development' || !!process.env.GENERATE

export const schema = makeSchema({
  types: [User, Reports],
  // Type the GraphQL context when used in Nexus resolvers
  contextType: {
    module: path.join(process.cwd(), './src/server/index.ts'),
    export: 'GraphQLContext',
  },
  // Generate the files
  shouldGenerateArtifacts,
  outputs: {
    typegen: path.join(process.cwd(), './src/graphql/nexus-types.generated.ts'),
    schema: path.join(process.cwd(), './src/graphql/schema.graphql'),
  },
})
