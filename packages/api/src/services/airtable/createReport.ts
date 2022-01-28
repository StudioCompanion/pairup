import { FieldResolver } from 'nexus'
import Airtable from 'airtable'

export const createReport: FieldResolver<'Mutation', 'reportsSubmitAbuse'> =
  async (_, args) => {
    const report = args

    const base = new Airtable({
      apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
    }).base('appt58t6XthcfoN5i')

    // await fetch('/api/createRecord', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(report),
    // }).then((result) => console.log('result is: ', result))

    const records = await base('Reports').create([
      {
        fields: {
          Name: report.name,
          Email: report.email,
          'Incident description': report.incidentDescription,
          'Pairer or Pairee': report.reportpairerOrPairee,
          'Nature of the abuse': report.natureOfTheAbuse,
          'Is the abuser a Pairer?': report.isTheAbuserAPairer,
        },
      },
    ])

    records.forEach(function (record) {
      console.log(record.getId())
    })
  }
