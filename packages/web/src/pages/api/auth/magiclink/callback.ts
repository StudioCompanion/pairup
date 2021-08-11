/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport'
import handler from 'server/api-route'

export default handler()
  .use(passport.authenticate('magiclogin'))
  .use(
    (
      req: { user: { redirect: any } },
      res: { redirect: (arg0: any) => void }
    ) => {
      res.redirect(req.user?.redirect || '/app')
    }
  )
