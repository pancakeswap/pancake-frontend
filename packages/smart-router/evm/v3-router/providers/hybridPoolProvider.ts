import { BigintIsh, Currency } from '@pancakeswap/sdk'

import { getPairCombinations } from '../functions'
import { OnChainProvider, Pool, PoolProvider, PoolType, SubgraphProvider } from '../types'
import { createPoolProviderWithCache } from './poolProviderWithCache'
import { getV2PoolsOnChain, getStablePoolsOnChain, getV3PoolsWithoutTicksOnChain } from './onChainPoolProviderFactory'

interface HybridProviderConfig {
  onChainProvider: OnChainProvider
  subgraphProvider?: SubgraphProvider
}

export function createHybridPoolProvider({ onChainProvider }: HybridProviderConfig): PoolProvider {
  const hybridPoolProvider: PoolProvider = {
    getCandidatePools: async (currencyA, currencyB, options) => {
      const pairs = getPairCombinations(currencyA, currencyB)
      return hybridPoolProvider.getPools(pairs, options)
    },

    getPools: async (pairs, { blockNumber, protocols }) => {
      return getPools(pairs, { provider: onChainProvider, blockNumber, protocols })
    },
  }

  return createPoolProviderWithCache(hybridPoolProvider)
}

interface Options {
  provider: OnChainProvider
  blockNumber?: BigintIsh
  protocols?: PoolType[]
}

async function getPools(
  pairs: [Currency, Currency][],
  { provider, blockNumber, protocols = [PoolType.V3, PoolType.V2, PoolType.STABLE] }: Options,
): Promise<Pool[]> {
  const chainId = pairs[0]?.[0]?.chainId
  if (!chainId) {
    return []
  }

  const poolSets = await Promise.all(
    protocols.map((protocol) => {
      if (protocol === PoolType.V2) {
        return getV2PoolsOnChain(pairs, provider, blockNumber)
      }
      if (protocol === PoolType.V3) {
        return getV3PoolsWithoutTicksOnChain(pairs, provider, blockNumber)
      }
      return getStablePoolsOnChain(pairs, provider, blockNumber)
    }),
  )

  return poolSets.reduce<Pool[]>((acc, cur) => [...acc, ...cur], [])
}
