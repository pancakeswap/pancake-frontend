import { formatUnits } from '@ethersproject/units'
import { getProvider } from '../provider'

export type FetchBalanceArgs = {
  /** Address or ANS name */
  address: string
  /** Chain id to use for provider */
  networkName?: string
  /** resource type */
  coin?: string
}

export type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: string
}

const DEFAULT_COIN = '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
const DEFAULT_COIN_DECIMALS = 8

export async function fetchBalance({ address, networkName, coin }: FetchBalanceArgs): Promise<FetchBalanceResult> {
  const provider = getProvider({ networkName })

  const resource = await provider.getAccountResource(address, DEFAULT_COIN || coin)

  const { value } = (resource.data as any).coin

  if (coin) {
    const [coinHoistAddress] = coin.split('::')
    // TODO: check address
    if (coinHoistAddress) {
      const coinResource = await provider.getAccountResource(coinHoistAddress, coin)

      const { decimals = 18, symbol } = coinResource.data as any

      return {
        decimals,
        formatted: formatUnits(value ?? '0', decimals ?? 18),
        symbol,
        value,
      }
    }
  }

  return {
    decimals: DEFAULT_COIN_DECIMALS,
    formatted: formatUnits(value ?? '0', DEFAULT_COIN_DECIMALS),
    symbol: 'APT',
    value,
  }
}
