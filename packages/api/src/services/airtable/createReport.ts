import { FieldResolver } from 'nexus'
import Airtable from 'airtable'

export const createReport: FieldResolver<'Mutation', 'reportsSubmitAbuse'> =
  async (_, args) => {
    const { name, email, description, isAbuserPairer, type } = args.report

    const base = new Airtable({
      apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
    }).base('appt58t6XthcfoN5i')

    try {
      await base('Reports').create({
        Name: name,
        Email: email,
        'Incident description': description,
        'Nature of the abuse': type,
        'Is the abuser a Pairer?': isAbuserPairer,
      })
    } catch {
      console.error()
    }

    return true
  }
