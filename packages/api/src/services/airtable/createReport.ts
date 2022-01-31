import { FieldResolver } from 'nexus'
import Airtable from 'airtable'

export const createReport: FieldResolver<'Mutation', 'reportsSubmitAbuse'> =
  async (_, args) => {
    const {
      name,
      email,
      incidentDescription,
      pairerOrPairee,
      natureOfAbuse,
      pairer,
    } = args

    const base = new Airtable({
      apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
    }).base('appt58t6XthcfoN5i')

    try {
      await base('Reports').create({
        Name: name,
        Email: email,
        'Incident description': incidentDescription,
        'Pairer or Pairee': pairerOrPairee,
        'Nature of the abuse': natureOfAbuse,
        'Is the abuser a Pairer?': pairer,
      })
    } catch {
      console.error()
    }

    return true
  }
