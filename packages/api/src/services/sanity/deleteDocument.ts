import { captureException, Scope } from '@sentry/node'

import { Logger } from '../../helpers/console'

import { getSanityClientWrite } from '../../lib/sanity'

export const deleteDocument = async (userId: string) => {
  try {
    const sanityClient = getSanityClientWrite()

    await sanityClient.delete({
      query: `*[_type == 'pairerProfile' && uuid == '${userId}']`,
    })
  } catch (err) {
    const errMsg = 'Failed to create sanity profile after account creation'
    Logger.error(errMsg, err)
    /**
     * If this fails we don't want to have to ask the
     * pairer for their details again so instead we
     * just send the profile to Sentry as an extra and
     * we can make the profile manually
     */
    captureException(
      errMsg,
      new Scope().setExtras({
        err,
        user: userId,
      })
    )
  }
}
