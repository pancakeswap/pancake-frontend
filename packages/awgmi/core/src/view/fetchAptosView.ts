import { Types } from 'aptos'
import { getProvider } from '../providers'

export type FetchAptosViewArgs = {
  /** Network to use for provider */
  networkName?: string
  params: Types.TransactionPayload_EntryFunctionPayload
}

export const fetchAptosView = async ({ networkName, params }: FetchAptosViewArgs): Promise<any> => {
  const provider = getProvider({ networkName })
  const url = `${provider.nodeUrl}/view`
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
