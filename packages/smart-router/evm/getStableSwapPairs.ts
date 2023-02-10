import { ChainId, CurrencyAmount } from '@pancakeswap/sdk'
import fromPairs_ from 'lodash/fromPairs'
import { getStableSwapPools } from './constants/stableSwap'
import { isStableSwapSupported, STABLE_SUPPORTED_CHAIN_IDS } from './constants/stableSwap/pools'
import { createStableSwapPair } from './stableSwap'
import { StableSwapPair } from './types'

function getStableSwapPairs(chainId: ChainId): StableSwapPair[] {
  // Stable swap is only supported on BSC chain & BSC testnet
  if (!isStableSwapSupported(chainId)) {
    return []
  }

  const pools = getStableSwapPools(chainId)
  return pools.map(({ token, quoteToken, stableSwapAddress, lpAddress, infoStableSwapAddress }) => {
    return createStableSwapPair(
      {
        token0: token,
        token1: quoteToken,
        reserve0: CurrencyAmount.fromRawAmount(token, '0'),
        reserve1: CurrencyAmount.fromRawAmount(quoteToken, '0'),
      },
      stableSwapAddress,
      lpAddress,
      infoStableSwapAddress,
    )
  })
}

export const stableSwapPairsByChainId = fromPairs_(
  STABLE_SUPPORTED_CHAIN_IDS.map((chainId) => [chainId, getStableSwapPairs(chainId)]),
)
