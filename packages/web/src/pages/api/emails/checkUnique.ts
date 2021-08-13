import handler from 'server/api-route'

import { checkIfEmailExists } from 'server/emails/checkUnique'

export default handler().post(checkIfEmailExists)
