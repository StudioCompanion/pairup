// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

/**
 * Documents
 */
import pairerProfile from './documents/pairerProfile'
import spamOrHarmful from './documents/spamOrHarmful'
import harassmentOrBullying from './documents/harassmentOrBullying'
import pretendingToBeSomeone from './documents/pretendingToBeSomeone'
import somethingElse from './documents/somethingElse'
import report from './documents/report'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /**
     * Documents
     */
    pairerProfile,
    spamOrHarmful,
    harassmentOrBullying,
    pretendingToBeSomeone,
    somethingElse,
    report,
  ]),
})
