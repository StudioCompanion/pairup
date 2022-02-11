import { extendType, idArg, nonNull } from 'nexus'

import { createSession } from '../../services/sessions/createSession'
import { cancelSession } from '../../services/sessions/cancelSession'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('sessionCreate', {
      type: 'SessionCreatePayload',
      description: 'create a session with a pairer',
      args: {
        paireeDetails: nonNull('SessionCreatePaireeInput'),
        pairerId: nonNull(idArg()),
      },
      resolve: createSession,
    })

    t.nullable.field('sessionCancel', {
      type: 'SessionCancelPayload',
      description: 'delete a session with a pairer',
      args: {
        sessionId: nonNull(idArg()),
      },
      resolve: cancelSession,
    })
  },
})
