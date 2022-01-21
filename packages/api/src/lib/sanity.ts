import client from '@sanity/client'

export const getSanityClientWrite = () =>
  client({
    apiVersion: 'latest',
    dataset: process.env.SANITY_DATASET,
    projectId: process.env.SANITY_PROJECT_ID,
    token: process.env.SANITY_API_KEY, // admin token has write access
    useCdn: false,
  })
