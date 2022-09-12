import { getProvider } from './provider'

export const APTOS_COIN = '0x1::aptos_coin::AptosCoin'
const APTOS_DECIMALS = 8
export const APTOS_SYMBOL = 'APT'
const NAME = 'Aptos coin'

const coinInfoTypeTag = (type: string) => `0x1::coin::CoinInfo<${type}>`

export type FetchCoinArgs = {
  /** Chain id to use for provider */
  networkName?: string
  /** resource type */
  coin?: string
}

export type FetchCoinResult = {
  decimals: number
  symbol: string
  name: string
}

export async function fetchCoin({ networkName, coin }: FetchCoinArgs): Promise<FetchCoinResult> {
  const provider = getProvider({ networkName })

  if (coin) {
    const [coinHoistAddress] = coin.split('::')
    // TODO: check address
    if (coinHoistAddress) {
      const coinResource = await provider.getAccountResource(coinHoistAddress, coinInfoTypeTag(coin))

      const { decimals = 18, symbol, name } = coinResource.data as any

      return {
        decimals,
        symbol,
        name,
      }
    }
  }

  return {
    decimals: APTOS_DECIMALS,
    symbol: APTOS_SYMBOL,
    name: NAME,
  }
}
