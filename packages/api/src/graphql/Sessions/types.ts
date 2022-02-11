import { objectType } from 'nexus'
import { Session } from 'nexus-prisma'

export const SessionType = objectType({
  name: Session.$name,
  description: 'A session created between a pairer and a pairee',
  definition: (t) => {
    t.field({
      ...Session.id,
      description: 'Id for the session',
    })
    t.field({
      ...Session.firstName,
      description: 'First name of the pairee',
    })
    t.field({
      ...Session.lastName,
      description: 'Last name of the pairee',
    })
    t.field({
      ...Session.jobTitle,
      description: 'Job title of the pairee',
    })
    t.field({
      ...Session.portfolio,
      description: 'Portfolio of the pairee',
    })
    t.field({
      ...Session.subjects,
      description: 'Subjects the pairee want to talk to the pairer about',
    })
    t.field({
      ...Session.appointment,
      description: 'Timestamp of when the appointment starts and finishes',
    })
  },
})

export const SessionCreatePayloadType = objectType({
  name: 'SessionCreatePayload',
  description: 'Payload from the sessionCreate mutation',
  definition: (t) => {
    t.field('Session', {
      type: 'Session',
    })
    t.list.field('SessionInputError', {
      type: 'InputErrors',
    })
  },
})

export const SessionCancelPayloadType = objectType({
  name: 'SessionCancelPayload',
  description: 'Payload from the sessionCancel mutation',
  definition: (t) => {
    t.id('sessionId')
    t.list.field('SessionInputError', {
      type: 'InputErrors',
    })
  },
})
