import { useState, useEffect } from 'react'

// endpoint to check asset exists and get url to CMC page
// returns 400 status code if token is not on CMC
const CMC_ENDPOINT = 'https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/contract?address='

/**
 * Check if asset exists on CMC, if exists
 * return  url, if not return undefined
 * @param address token address (all lowercase, checksummed are not supported by CMC)
 */
const useCMCLink = (address: string): string | undefined => {
  const [cmcPageUrl, setCMCPageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchLink = async () => {
      const result = await fetch(`${CMC_ENDPOINT}${address}`)
      // if link exists, format the url
      if (result.status === 200) {
        result.json().then(({ data }) => {
          setCMCPageUrl(data.url)
        })
      }
    }
    if (address) {
      fetchLink()
    }
  }, [address])

  return cmcPageUrl
}

export default useCMCLink
