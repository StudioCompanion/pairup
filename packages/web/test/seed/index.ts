import { Availability, PairerDetails, Prisma, User } from '@prisma/client'

import prisma from 'db/prisma'

import { testData } from './data'

export interface SeedData {
  users: Array<
    Omit<User, 'id' | 'createdAt' | 'modifiedAt'> & {
      pairerDetails: {
        create: Omit<
          PairerDetails,
          'id' | 'createdAt' | 'modifiedAt' | 'userId'
        > & {
          availability: {
            create: Omit<Availability, 'id' | 'createdAt' | 'modifiedAt'>
          }
        }
      }
    }
  >
}

// Inspired by prisma/docs#451
async function emptyDatabase() {
  const tables = Prisma.dmmf.datamodel.models.map(
    (model) => model.dbName || model.name
  )

  await Promise.all(
    tables.map((table) => prisma.$executeRaw(`DELETE FROM "${table}";`))
  )
}

async function seedDatabase({ users }: SeedData) {
  // Insert users
  await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
        include: {
          pairerDetails: {
            include: {
              availability: true,
            },
          },
        },
      })
    )
  )
}

export async function reseedDatabase(data: SeedData = testData) {
  await emptyDatabase()
  await seedDatabase(data)
}
