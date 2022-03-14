// Global setup for Jest, will run once per test file
import { reseedDatabase } from './seed'
import { prisma } from '@pairup/api/src/db/prisma'
import { server } from './msw/server'

/**
 * Our mocks are written here so we can override them
 * in the test files for the purpose of testing
 * various things.
 * e.g. Sanity Client actually patches a document
 */
jest.mock('postmark', () => ({
  ServerClient: () => ({
    sendEmailWithTemplate: async () =>
      new Promise((res) => res({ data: null })),
  }),
}))

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  })
  server.printHandlers()
})

beforeEach(async () => {
  await reseedDatabase()
})

afterEach(() => server.resetHandlers())

afterAll(async () => {
  // Disconnect Prisma from the database after all tests are complete
  // to avoid open handles stopping Jest from exiting
  server.close()
  await prisma.$disconnect()
})
