import { ChainId, CurrencyAmount } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import fromPairs_ from 'lodash/fromPairs'
import { StableSwapPair } from './types'
import { createStableSwapPair } from './stableSwap'
import { getStableSwapPools } from './constants/stableSwap'
import { STABLE_SUPPORTED_CHAIN_IDS } from './constants/stableSwap/pools'

export function getStableSwapPairs(chainId: ChainId): StableSwapPair[] {
  const pools = getStableSwapPools(chainId)
  return pools.map(
    ({
      token,
      quoteToken,
      stableSwapAddress,
      lpAddress,
      infoStableSwapAddress,
      stableLpFee,
      stableLpFeeRateOfTotalFee,
    }) => {
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
        lpAddress,
        infoStableSwapAddress,
        stableLpFee,
        stableLpFeeRateOfTotalFee,
      )
    },
  )
}

export const stableSwapPairsByChainId = fromPairs_(
  STABLE_SUPPORTED_CHAIN_IDS.map((chainId) => [chainId, getStableSwapPairs(chainId)]),
)
