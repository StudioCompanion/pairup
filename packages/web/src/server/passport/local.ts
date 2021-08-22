import { Strategy } from 'passport-local'

// Configure the local strategy for use by Passport.
//
// The local strategy requires a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
export const local = new Strategy((username, password, cb) => {
  // console.log('STRATEGY', username, password, cb)
})
