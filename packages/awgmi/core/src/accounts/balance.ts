import { CoinStoreResult, wrapCoinStoreTypeTag } from '../coins/coinStore'
import { APTOS_COIN } from '../constants'
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
  const provider = getProvider({ networkName })

  const resource = await provider.getAccountResource(address, wrapCoinStoreTypeTag(coin || APTOS_COIN))

  const { value } = (resource.data as CoinStoreResult).coin

  return {
    value,
  }
}
