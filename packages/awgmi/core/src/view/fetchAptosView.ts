import { ViewFunctionJsonPayload } from '@aptos-labs/ts-sdk'

import { getProvider } from '../providers'

export type FetchAptosViewArgs = {
  /** Network to use for provider */
  networkName?: string
  params: ViewFunctionJsonPayload
}

export const fetchAptosView = async ({ networkName, params }: FetchAptosViewArgs): Promise<any> => {
  const provider = getProvider({ networkName })
  const url = `${provider.config.fullnode}/view`
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Fetch Aptos View Error: ', error)
    return null
  }
}
