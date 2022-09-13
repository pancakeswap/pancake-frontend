import { fetchCoin } from '@pancakeswap/awgmi/core'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId, useActiveNetwork } from './useNetwork'

export function useCoin(coinId?: string) {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()

  return useSWRImmutable(coinId && networkName && chainId ? [coinId, networkName, chainId] : null, async () => {
    if (!chainId || !coinId) return undefined
    const { decimals, symbol, name } = await fetchCoin({ networkName, coin: coinId })

    return new Coin(chainId, coinId, decimals, symbol, name)
  })
}
