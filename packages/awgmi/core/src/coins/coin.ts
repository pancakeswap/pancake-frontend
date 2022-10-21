import { wrapCoinInfoTypeTag } from './coinInfo'
import { getProvider } from '../providers'
import { APT, APTOS_COIN } from '../constants'
import { isAccountAddress, isHexStringEquals } from '../utils'

export type FetchCoinArgs = {
  /** Network name to use for provider */
  networkName?: string
  /** resource type */
  coin?: string
}

type Vec<T = undefined> = {
  vec: Array<T>
}

// Custom vec type supply
type Supply = Vec<{
  aggregator: Vec
  integer: Vec<{
    limit: string
    value: string
  }>
}>

type CoinResourceResponse = {
  decimals: number
  symbol: string
  name: string
  supply: Supply
}

export type FetchCoinResult = {
  address: string
  decimals: number
  symbol: string
  name: string
  supply?: string
}

export async function fetchCoin({ networkName, coin }: FetchCoinArgs): Promise<FetchCoinResult> {
  const provider = getProvider({ networkName })

  if (coin && !isHexStringEquals(coin, APTOS_COIN)) {
    const [coinAccountAddress] = coin.split('::')
    if (isAccountAddress(coinAccountAddress)) {
      const coinResource = await provider.getAccountResource(coinAccountAddress, wrapCoinInfoTypeTag(coin))

      const { decimals = 18, symbol, name, supply: _supply } = coinResource.data as CoinResourceResponse

      let supply: string | undefined

      if (_supply?.vec?.[0]?.integer?.vec?.[0]?.value) {
        supply = _supply?.vec?.[0]?.integer?.vec?.[0]?.value
      }

      return {
        address: coin,
        decimals,
        symbol,
        name,
        supply,
      }
    }
    throw new Error(`coin is invalid: ${coin}`)
  }

  return APT
}
