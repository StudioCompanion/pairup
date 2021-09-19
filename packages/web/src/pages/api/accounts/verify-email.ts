import handler from 'server/middleware/api-route'

import { verifyEmail } from 'server/services/accounts/verify-email'

export default handler().get(verifyEmail)
