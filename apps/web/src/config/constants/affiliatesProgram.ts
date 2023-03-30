export const host = (locationHost: string) => {
  // eslint-disable-next-line no-console
  console.log('locationHost', locationHost)
  if (locationHost === 'pancakeswap.finance') {
    return '.pancakeswap.finance'
  }

  const hostName = process.env.NEXT_PUBLIC_VERCEL_URL ?? ''
  if (hostName.includes('.pancake.run')) {
    return '.pancake.run'
  }

  return 'localhost'
}

export const MAX_AGE = 60 * 60 * 24
