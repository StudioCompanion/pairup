import handler from 'server/middleware/api-route'

import { checkIfEmailExists } from 'server/services/emails/checkUnique'

export default handler().post(checkIfEmailExists)
