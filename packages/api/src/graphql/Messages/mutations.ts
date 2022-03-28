import { extendType, idArg, nonNull, stringArg } from 'nexus'

import { submitMessage } from '../../services/messages/submitMessage'

export const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('messageSubmit', {
      type: 'MessageSubmitPayload',
      description: 'Submit a new message to be sent to a pairee',
      args: {
        message: nonNull(stringArg()),
        pairerId: nonNull(idArg()),
      },
      resolve: submitMessage,
    })
  },
})
