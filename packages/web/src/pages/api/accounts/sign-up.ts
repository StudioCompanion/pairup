import handler from 'server/api-route'

import { signup } from 'server/accounts/sign-up'

export default handler().post(signup)
