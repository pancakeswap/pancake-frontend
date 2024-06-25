import { MoveStructId } from '@aptos-labs/ts-sdk'

import { fetchAptosView } from '../view/fetchAptosView'

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
