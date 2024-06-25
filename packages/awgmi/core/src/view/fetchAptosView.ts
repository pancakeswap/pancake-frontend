import { InputViewFunctionData } from '@aptos-labs/ts-sdk'

import { getProvider } from '../providers'

export type FetchAptosViewArgs = {
  /** Network to use for provider */
  networkName?: string
  params: InputViewFunctionData
}

export const fetchAptosView = async ({ networkName, params }: FetchAptosViewArgs): Promise<any> => {
  const provider = getProvider({ networkName })

  try {
    const data = await provider.view({
      payload: params,
    })
    return data
  } catch (error) {
    console.error('Fetch Aptos View Error: ', error)
    return null
  }
}
