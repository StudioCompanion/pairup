import passport from 'passport'
import magicLink from './magicLink'
import prisma from '../db/prisma'
import { randomUUID } from 'crypto'

passport.use(magicLink)

// This types passport.(de)serializeUser!
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string
      email: string
      provider: string
      redirect?: string
    }
  }
}

passport.serializeUser(async (u: Express.User, done) => {
  const email = u.email.toLowerCase()
  const hashedPassword = ''
  const salt = ''
  const user = await prisma.user.upsert({
    create: {
      userId: randomUUID(),
      salt,
      hashedPassword,
      email,
    },
    update: {},
    where: {
      email,
    },
  })

  done(null, {
    ...u,
    id: user.id,
  })
})

passport.deserializeUser((user: Express.User, done) => {
  done(null, user)
})

export default passport
