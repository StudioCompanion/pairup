import passport from 'passport'

import { local } from './local'

import prisma from '../db/prisma'

passport.use(local)

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
  // console.log('USER', u)
  const email = u.email.toLowerCase()
  const hashedPassword = ''

  // pbkdf2(u.pas)

  // const user = await prisma.user.upsert({
  //   create: {
  //     userId: randomUUID(),
  //     salt,
  //     hashedPassword,
  //     email,
  //   },
  //   update: {},
  //   where: {
  //     email,
  //   },
  // })

  // done(null, {
  //   ...u,
  //   id: user.id,
  // })
})

passport.deserializeUser((user: Express.User, done) => {
  done(null, user)
})

export default passport
