import Airtable from 'airtable'

export const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base('appt58t6XthcfoN5i')
