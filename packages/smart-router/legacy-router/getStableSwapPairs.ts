import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount } from '@pancakeswap/sdk'
import { getStableSwapPools, STABLE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/stable-swap-sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import fromPairs_ from 'lodash/fromPairs.js'

import { createStableSwapPair } from './stableSwap'
import { StableSwapPair } from './types'

export function getStableSwapPairs(chainId: ChainId): StableSwapPair[] {
  const pools = getStableSwapPools(chainId)
  return pools.map(
    ({
      token: serializedToken,
      quoteToken: serializedQuoteToken,
      stableSwapAddress,
      lpAddress,
      infoStableSwapAddress,
      stableLpFee,
      stableTotalFee,
      stableLpFeeRateOfTotalFee,
    }) => {
      const token = deserializeToken(serializedToken)
      const quoteToken = deserializeToken(serializedQuoteToken)
      const [token0, token1] = token.sortsBefore(quoteToken) ? [token, quoteToken] : [quoteToken, token]
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
        stableTotalFee,
        stableLpFeeRateOfTotalFee,
      )
    },
  )
}

export const stableSwapPairsByChainId = fromPairs_(
  STABLE_SUPPORTED_CHAIN_IDS.map((chainId) => [chainId, getStableSwapPairs(chainId)]),
)
