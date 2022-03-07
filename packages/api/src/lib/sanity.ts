import client from '@sanity/client'

export const getSanityClientWrite = () =>
  client({
    apiVersion: '2022-01-25',
    dataset: process.env.SANITY_DATASET,
    projectId: process.env.SANITY_PROJECT_ID,
    token: process.env.SANITY_API_KEY, // admin token has write access
    useCdn: false,
  })

export const getSanityClientRead = () => {
  console.log('DEBUG >>>>>>>', {
    dataset: process.env.SANITY_DATASET,
    projectId: process.env.SANITY_PROJECT_ID,
    token: process.env.SANITY_API_KEY,
  })

  return client({
    apiVersion: '2022-01-25',
    dataset: process.env.SANITY_DATASET,
    projectId: process.env.SANITY_PROJECT_ID,
    token: process.env.SANITY_API_KEY, // admin token has write access
    useCdn: true,
  })
}
