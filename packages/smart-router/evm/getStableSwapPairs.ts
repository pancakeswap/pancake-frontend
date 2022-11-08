import { ChainId, CurrencyAmount, Pair } from '@pancakeswap/sdk'
import { getStableConfig } from '@pancakeswap/farms/constants'
import { deserializeToken } from '@pancakeswap/token-lists'

import { StableSwapPair } from './types'
import { createStableSwapPair } from './stableSwap'

export async function getStableSwapPairs(chainId: ChainId): Promise<StableSwapPair[]> {
  // Stable swap is only supported on BSC chain & BSC testnet
  if (chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET) {
    return []
  }

  const farms = await getStableConfig(chainId)

  return farms.map(({ token, quoteToken, stableSwapAddress }) => {
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(deserializeToken(token), '0'),
      CurrencyAmount.fromRawAmount(deserializeToken(quoteToken), '0'),
    )
    return createStableSwapPair(pair, stableSwapAddress)
  })
}
