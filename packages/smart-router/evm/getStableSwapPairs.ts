import { ChainId, CurrencyAmount } from '@pancakeswap/sdk'
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
    const token0 = deserializeToken(token)
    const token1 = deserializeToken(quoteToken)
    return createStableSwapPair(
      {
        token0,
        token1,
        reserve0: CurrencyAmount.fromRawAmount(token0, '0'),
        reserve1: CurrencyAmount.fromRawAmount(token1, '0'),
      },
      stableSwapAddress,
    )
  })
}
