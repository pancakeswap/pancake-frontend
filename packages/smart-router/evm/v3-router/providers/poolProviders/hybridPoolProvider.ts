import { OnChainProvider, PoolProvider, SubgraphProvider } from '../../types'
import { createPoolProviderWithCache } from './poolProviderWithCache'
import { getCandidatePools } from './getCandidatePools'

export interface HybridPoolProviderConfig {
  onChainProvider?: OnChainProvider
  v2SubgraphProvider?: SubgraphProvider
  v3SubgraphProvider?: SubgraphProvider
}

export function createHybridPoolProvider({
  onChainProvider,
  v2SubgraphProvider,
  v3SubgraphProvider,
}: HybridPoolProviderConfig): PoolProvider {
  const hybridPoolProvider: PoolProvider = {
    getCandidatePools: async (params) => {
      return getCandidatePools({ ...params, onChainProvider, v2SubgraphProvider, v3SubgraphProvider })
    },
  }

  return createPoolProviderWithCache(hybridPoolProvider)
}
