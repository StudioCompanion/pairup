import { SanityCodegenConfig } from 'sanity-codegen'

const config: SanityCodegenConfig = {
  schemaPath: './schemas/schema.js',
  outputPath: '../web/src/types/sanity.generated.ts',
}

export default config
