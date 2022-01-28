import { FieldResolver } from 'nexus'

import { base } from 'airtable'

export const createReport: FieldResolver<'Mutation', 'reportsSubmitAbuse'> =
  async (_, args) => {
    const {
      name,
      email,
      incidentDescription,
      pairerOrPairee,
      isTheAbuserAPairer,
      natureOfTheAbuse,
    } = args

    try {
      await base('Reports').create(
        [
          {
            fields: {
              Name: name,
              Email: email,
              'Incident description': incidentDescription,
              'Pairer or Pairee': pairerOrPairee,
              'Nature of the abuse': natureOfTheAbuse,
              'Is the abuser a Pairer?': isTheAbuserAPairer,
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
    } catch (err: unknown) {
      return 'Failed to create abuse report!'
    }
  }
