import { FieldResolver } from 'nexus'

import { base, Record, CreateMultipleRecordsMutation } from 'airtable'

export const createReport: FieldResolver<'Mutation', 'reportsSubmitAbuse'> =
  async (_, args) => {
    const report = args

    // await fetch('/api/createRecord', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(report),
    // }).then((result) => console.log('result is: ', result))

    await base('Reports').create(
      [
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
      ],
      function (err, records) {
        if (err) {
          console.error(err)
          return
        }
        records.forEach(function (record) {
          console.log(record.getId())
        })
      }
    )
  }
