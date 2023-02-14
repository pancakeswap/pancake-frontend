import { BigintIsh, Currency } from '@pancakeswap/sdk'

import { getPairCombinations } from '../functions'
import { OnChainProvider, Pool, PoolProvider, SubgraphProvider } from '../types'
import { createPoolProviderWithCache } from './poolProviderWithCache'
import { getV2PoolsOnChain, getStablePoolsOnChain, getV3PoolsWithoutTicksOnChain } from './onChainPoolProviderFactory'

interface HybridProviderConfig {
  onChainProvider: OnChainProvider
  subgraphProvider?: SubgraphProvider
}

export function createHybridPoolProvider({ onChainProvider }: HybridProviderConfig): PoolProvider {
  const hybridPoolProvider: PoolProvider = {
    getCandidatePools: async (currencyA, currencyB, blockNumber) => {
      const pairs = getPairCombinations(currencyA, currencyB)
      return hybridPoolProvider.getPools(pairs, blockNumber)
    },

    getPools: async (pairs, blockNumber) => {
      return getPools(pairs, { provider: onChainProvider, blockNumber })
    },
  }

  return createPoolProviderWithCache(hybridPoolProvider)
}

interface Options {
  provider: OnChainProvider
  blockNumber: BigintIsh
}

async function getPools(pairs: [Currency, Currency][], { provider, blockNumber }: Options): Promise<Pool[]> {
  const chainId = pairs[0]?.[0]?.chainId
  if (!chainId) {
    return []
  }

  const [v2Pools, stablePools, v3Pools] = await Promise.all([
    getV2PoolsOnChain(pairs, provider, blockNumber),
    getStablePoolsOnChain(pairs, provider, blockNumber),
    getV3PoolsWithoutTicksOnChain(pairs, provider, blockNumber),
  ])
  return [...v2Pools, ...stablePools, ...v3Pools]
}
