import { wrapCoinInfoTypeTag } from './coinInfo'
import { getProvider } from '../providers'
import { APT, APTOS_COIN } from '../constants'
import { isAccountAddress, isHexStringEquals } from '../utils'
import { fetchAptosView } from '../view/fetchAptosView'

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
      const [coinResource, coinSupply] = await Promise.all([
        provider.getAccountResource({
          accountAddress: coinAccountAddress,
          resourceType: wrapCoinInfoTypeTag(coin),
        }),
        fetchAptosView({
          networkName,
          params: {
            typeArguments: [coin],
            function: '0x1::coin::supply',
            functionArguments: [],
          },
        }),
      ])

      const { decimals = 18, symbol, name } = coinResource as CoinResourceResponse

      let supply: string | undefined

      if (coinSupply?.[0]?.vec?.[0]) {
        supply = coinSupply?.[0]?.vec?.[0]
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
