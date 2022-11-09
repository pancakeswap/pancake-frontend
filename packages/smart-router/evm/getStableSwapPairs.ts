import { ChainId, CurrencyAmount, Pair } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'

import { StableSwapPair } from './types'
import { createStableSwapPair } from './stableSwap'
import { getStableSwapPools } from './constants/stableSwap'

export function getStableSwapPairs(chainId: ChainId): StableSwapPair[] {
  // Stable swap is only supported on BSC chain & BSC testnet
  if (chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET) {
    return []
  }

  const pools = getStableSwapPools(chainId)
  return pools.map(({ token, quoteToken, stableSwapAddress }) => {
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(deserializeToken(token), '0'),
      CurrencyAmount.fromRawAmount(deserializeToken(quoteToken), '0'),
    )
    return createStableSwapPair(pair, stableSwapAddress)
  })
}
