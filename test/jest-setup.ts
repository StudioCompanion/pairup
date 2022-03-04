// Global setup for Jest, will run once per test file
import { reseedDatabase } from './seed'
import { prisma } from '@pairup/api/src/db/prisma'

/**
 * Our mocks are written here so we can override them
 * in the test files for the purpose of testing
 * various things.
 * e.g. Sanity Client actually patches a document
 */
jest.mock('@sanity/client', () => jest.fn())
jest.mock('postmark', () => ({
  ServerClient: jest.fn(),
}))
jest.mock('airtable', () => {
  return class MockedAirtableClass {
    base() {
      return () => ({
        create: jest.fn().mockImplementation((report) => ({
          ...report,
          getId: jest.fn(),
        })),
      })
    }
  }
})

beforeEach(async () => {
  await reseedDatabase()
})

afterAll(() => {
  // Disconnect Prisma from the database after all tests are complete
  // to avoid open handles stopping Jest from exiting
  prisma.$disconnect()
})
