import { OnChainProvider, PoolProvider, SubgraphProvider } from '../../types'
import { createPoolProviderWithCache } from './poolProviderWithCache'
import { getCandidatePools } from './getCandidatePools'

interface HybridProviderConfig {
  onChainProvider?: OnChainProvider
  subgraphProvider?: SubgraphProvider
}

export function createHybridPoolProvider({ onChainProvider, subgraphProvider }: HybridProviderConfig): PoolProvider {
  const hybridPoolProvider: PoolProvider = {
    getCandidatePools: async (params) => {
      return getCandidatePools({ ...params, onChainProvider, subgraphProvider })
    },
  }

  return createPoolProviderWithCache(hybridPoolProvider)
}
