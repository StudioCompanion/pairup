import passport from 'passport'

import { CreatedUser } from 'server/services/accounts/sign-up'

import { local } from './local'

passport.use(local)

// This types passport.(de)serializeUser!
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends CreatedUser {}
  }
}

passport.serializeUser((user: Express.User, done) => {
  const { userId, email } = user

  done(null, {
    userId,
    email,
  })
})

passport.deserializeUser((user: Express.User, done) => {
  done(null, user)
})

export default passport
