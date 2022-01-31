import { captureException, Scope } from '@sentry/node'
import jwt from 'jsonwebtoken'

import { Logger } from './console'

export interface RefreshOptions {
  verifyOptions?: jwt.VerifyOptions
  signOptions?: jwt.SignOptions
}

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Taken from https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
 *
 * Used to refresh a users token regardless of the expiry date.
 */
export const refreshToken = (token: string, opts?: RefreshOptions) => {
  try {
    if (!JWT_SECRET) {
      throw new Error('No JWT_SECRET set – cannot refresh tokens')
    }

    const payload = jwt.verify(token, JWT_SECRET, opts?.verifyOptions)
    return jwt.sign(payload, JWT_SECRET, opts?.signOptions)
  } catch (err) {
    const errMsg = 'Failed to refresh User Token'
    Logger.error(errMsg, err)
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
      })
    )
  }
}
