import { setupServer } from 'msw/node'

import { sanityHandlers } from './handlers/sanity'
import { airtableHandlers } from './handlers/airtable'

export const server = setupServer(...sanityHandlers, ...airtableHandlers)
