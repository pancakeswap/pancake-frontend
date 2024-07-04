import { MoveStructId, GetAccountCoinsDataResponse } from '@aptos-labs/ts-sdk'

import { fetchAptosView } from '../view/fetchAptosView'
import { getProvider } from '../providers'

export type FetchBalanceArgs = {
  /** Address */
  address: string
  /** Network to use for provider */
  networkName?: string
  /** resource type */
  coin?: string
}

export type FetchBalanceResult = {
  value: string
}

export async function fetchBalance({ address, networkName, coin }: FetchBalanceArgs): Promise<FetchBalanceResult> {
  const [balance] = await fetchAptosView({
    networkName,
    params: {
      function: '0x1::coin::balance',
      functionArguments: [address],
      typeArguments: [coin as MoveStructId],
    },
  })
  return { value: balance }
}

export async function fetchBalances({ address, networkName }: FetchBalanceArgs): Promise<GetAccountCoinsDataResponse> {
  const provider = getProvider({ networkName })
  return provider.getAccountCoinsData({
    accountAddress: address,
  })
}
