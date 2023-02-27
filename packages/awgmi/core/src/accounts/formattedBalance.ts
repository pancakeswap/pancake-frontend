import { formatUnits } from '@ethersproject/units'
import { fetchCoin } from '../coins/coin'
import { CoinStoreResult, wrapCoinStoreTypeTag } from '../coins/coinStore'
import { APTOS_COIN } from '../constants'
import { getProvider } from '../providers'

export type FetchFormattedBalanceArgs = {
  /** Address */
  address: string
  /** Network to use for provider */
  networkName?: string
  /** resource type */
  coin?: string
}

export type FetchFormattedBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: string
}

export async function fetchFormattedBalance({
  address,
  networkName,
  coin,
}: FetchFormattedBalanceArgs): Promise<FetchFormattedBalanceResult> {
  const provider = getProvider({ networkName })

  const resource = await provider.getAccountResource(address, wrapCoinStoreTypeTag(coin || APTOS_COIN))

  const { value } = (resource.data as CoinStoreResult).coin

  const { decimals, symbol } = await fetchCoin({ networkName, coin })

  return {
    decimals,
    symbol,
    formatted: formatUnits(value ?? '0', decimals),
    value,
  }
}
