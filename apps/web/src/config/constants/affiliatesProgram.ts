const host = () => {
  const key = '.pancake.'
  const hostName = process.env.NEXT_PUBLIC_VERCEL_URL ? process.env.NEXT_PUBLIC_VERCEL_URL.split(key)[1] : ''
  return process.env.NEXT_PUBLIC_VERCEL_URL ? `${key}${hostName}` : 'localhost'
}

export const HOST = host()
export const MAX_AGE = 60 * 60 * 24
