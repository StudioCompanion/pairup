import { User, Session, Message } from '@prisma/client'

import { prisma } from '@pairup/api/src/db/prisma'

import { testData } from './data'

export interface SeedData {
  users: Array<Omit<User, 'id' | 'resetToken'>>
  sessions: Array<Session>
  messages: Array<Message>
}

// Inspired by prisma/docs#451
async function emptyDatabase() {
  // delete them in order otherwise it throws a fit
  const tables = ['Message', 'Session', 'User']

  for (const index in tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${tables[index]}";`)
  }
}

async function seedDatabase({ users, sessions, messages }: SeedData) {
  // Insert users
  await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  )

  await Promise.all(
    sessions.map((sess) =>
      prisma.session.create({
        data: sess,
      })
    )
  )

  await Promise.all(
    messages.map((msg) =>
      prisma.message.create({
        data: msg,
      })
    )
  )
}

export async function reseedDatabase(data: SeedData = testData) {
  await emptyDatabase()
  await seedDatabase(data)
}
