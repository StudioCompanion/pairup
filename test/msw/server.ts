import { setupServer } from 'msw/node'

import { sanityHandlers } from './handlers/sanity'

export const server = setupServer(...sanityHandlers)
