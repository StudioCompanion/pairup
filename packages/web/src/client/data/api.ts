import { POST_API_SLUGS } from 'references/slugs'

export enum API_METHODS {
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
}

type INTERNAL_API_ROUTES = POST_API_SLUGS

type API_ROUTES = INTERNAL_API_ROUTES

export const fetchApi = async (
  method: API_METHODS,
  slug: API_ROUTES,
  data: Record<string, unknown>
) => {
  try {
    if (method === API_METHODS.POST) {
      const res = await fetch(slug, {
        method: API_METHODS.POST,
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      return res
    } else if (method === API_METHODS.GET) {
      const res = await fetch(slug, {
        method: API_METHODS.GET,
      })
      return res
    } else if (method === API_METHODS.DELETE) {
      console.warn('WRITE API METHOD DELETE')
    }

    console.warn(`method: ${method}, is not support`)
  } catch (e) {
    console.error(e)
  }
}
