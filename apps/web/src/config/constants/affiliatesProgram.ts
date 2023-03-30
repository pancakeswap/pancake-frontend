const host = () => {
  const hostName = process.env.NEXT_PUBLIC_VERCEL_URL ?? ''

  if (hostName.includes('.pancake.run')) {
    return '.pancake.run'
  }

  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return '.pancakeswap.finance'
  }

  return 'localhost'
}

export const HOST = host()
export const MAX_AGE = 60 * 60 * 24
