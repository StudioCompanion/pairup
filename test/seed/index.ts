import { Prisma, User } from '@prisma/client'

import prisma from '@pairup/api/src/db/prisma'

import { testData } from './data'

export interface SeedData {
  users: Array<Omit<User, 'id'>>
}

// Inspired by prisma/docs#451
async function emptyDatabase() {
  const tables = Prisma.dmmf.datamodel.models.map(
    (model) => model.dbName || model.name
  )

  await Promise.all(
    tables.map((table) =>
      // @ts-expect-error pls no
      prisma.$executeRaw(`DELETE FROM "${table}";`)
    )
  )
}

async function seedDatabase({ users }: SeedData) {
  // Insert users
  await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  )
}

export async function reseedDatabase(data: SeedData = testData) {
  await emptyDatabase()
  await seedDatabase(data)
}
