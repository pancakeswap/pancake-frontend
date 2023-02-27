import useSWRImmutable from 'swr/immutable'

// endpoint to check asset exists and get url to CMC page
// returns 400 status code if token is not on CMC
const CMC_ENDPOINT = 'https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/contract?address='

/**
 * Check if asset exists on CMC, if exists
 * return url, if not return undefined
 * @param address token address (all lowercase, checksummed are not supported by CMC)
 */
const useCMCLink = (address: string): string | undefined => {
  const { data: cmcPageUrl } = useSWRImmutable(address ? ['cmcLink', address] : null, async () => {
    const response = await fetch(`${CMC_ENDPOINT}${address}`)

    if (response.ok) {
      return (await response.json()).data.url
    }
    return undefined
  })

  return cmcPageUrl
}

export default useCMCLink
