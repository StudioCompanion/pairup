export const createToken = async (body: string): Promise<string> => {
  const encoder = new TextEncoder()
  const algorithm = { name: 'HMAC', hash: 'SHA-256' }
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(process.env.SANITY_STUDIO_SECRET),
    algorithm,
    false,
    ['verify', 'sign']
  )

  const token = await crypto.subtle.sign(
    algorithm.name,
    key,
    encoder.encode(body)
  )

  return btoa(String.fromCharCode(...new Uint8Array(token)))
}
