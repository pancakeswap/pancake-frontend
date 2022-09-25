import { wrapCoinInfoTypeTag } from './coinInfo'
import { getProvider } from '../provider'
import { APTOS_COIN } from '../constants'

const APTOS_DECIMALS = 8
export const APTOS_SYMBOL = 'APT'
const NAME = 'Aptos coin'

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
  decimals: number
  symbol: string
  name: string
  supply?: string
}

export async function fetchCoin({ networkName, coin }: FetchCoinArgs): Promise<FetchCoinResult> {
  const provider = getProvider({ networkName })

  if (coin && coin !== APTOS_COIN) {
    const [coinHoistAddress] = coin.split('::')
    // TODO: check address
    if (coinHoistAddress) {
      const coinResource = await provider.getAccountResource(coinHoistAddress, wrapCoinInfoTypeTag(coin))

      const { decimals = 18, symbol, name, supply: _supply } = coinResource.data as CoinResourceResponse

      let supply: string | undefined

      if (_supply?.vec?.[0]?.integer?.vec?.[0]?.value) {
        supply = _supply?.vec?.[0]?.integer?.vec?.[0]?.value
      }

      return {
        decimals,
        symbol,
        name,
        supply,
      }
    }
  }

  return {
    decimals: APTOS_DECIMALS,
    symbol: APTOS_SYMBOL,
    name: NAME,
  }
}
