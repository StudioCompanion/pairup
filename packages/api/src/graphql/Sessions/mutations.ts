import { extendType, idArg, nonNull } from 'nexus'

import { createSession } from '../../services/sessions/createSession'

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
  },
})
