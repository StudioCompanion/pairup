import { objectType } from 'nexus'
import { Message } from 'nexus-prisma'

export const MessageType = objectType({
  name: Message.$name,
  description: 'Message entry from the database, relating to a session',
  definition: (t) => {
    t.field({
      ...Message.id,
      description: 'Id for the message',
    })
    t.field({
      ...Message.message,
      description: 'The actual message',
    })
    t.field({
      ...Message.sessionId,
      description: 'The id of the related session',
    })
  },
})

export const MessageSubmitPayloadType = objectType({
  name: 'MessageSubmitPayload',
  description: 'Payload from the messageSubmit mutation',
  definition: (t) => {
    t.field('Message', {
      type: 'Message',
    })
    t.list.field('MessageInputError', {
      type: 'InputErrors',
    })
  },
})
