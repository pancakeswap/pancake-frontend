const host = () => {
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return '.pancakeswap.finance'
  }

  const key = '.pancake.'
  const hostName = process.env.NEXT_PUBLIC_VERCEL_URL ? process.env.NEXT_PUBLIC_VERCEL_URL.split(key)[1] : ''
  return process.env.NEXT_PUBLIC_VERCEL_URL ? `${key}${hostName}` : 'localhost'
}

export const HOST = host()
export const MAX_AGE = 60 * 60 * 24
