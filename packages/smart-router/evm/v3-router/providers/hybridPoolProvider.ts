import { Currency } from '@pancakeswap/sdk'

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

    getPool: async () => {
      return null
    },

    getPools: async (pairs, blockNumber) => {
      // eslint-disable-next-line
      console.log(blockNumber)
      return getPools(pairs, { provider: onChainProvider })
    },
  }

  return createPoolProviderWithCache(hybridPoolProvider)
}

interface Options {
  provider: OnChainProvider
}

async function getPools(pairs: [Currency, Currency][], { provider }: Options): Promise<Pool[]> {
  const chainId = pairs[0]?.[0]?.chainId
  if (!chainId) {
    return []
  }

  const [v2Pools, stablePools, v3Pools] = await Promise.all([
    getV2PoolsOnChain(pairs, provider),
    getStablePoolsOnChain(pairs, provider),
    getV3PoolsWithoutTicksOnChain(pairs, provider),
  ])
  return [...v2Pools, ...stablePools, ...v3Pools]
}
