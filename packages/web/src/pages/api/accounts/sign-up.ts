import handler from 'server/middleware/api-route'

import { signup } from 'server/services/accounts/sign-up'

export default handler().post(signup)
