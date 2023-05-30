import { PoolProvider, OnChainProvider, SubgraphProvider } from '../../types'
import { createHybridPoolProvider } from './hybridPoolProvider'

interface Config {
  onChainProvider: OnChainProvider
  subgraphProvider?: SubgraphProvider
}

// For evm
export function createPoolProvider(config: Config): PoolProvider {
  const hybridPoolProvider = createHybridPoolProvider(config)
  return hybridPoolProvider
}

export * from './onChainPoolProviders'
export * from './subgraphPoolProviders'
export * from './poolTvlSelectors'
export * from './hybridPoolProvider'
export * from './staticPoolProvider'
export * from './getV2CandidatePools'
export * from './getV3CandidatePools'
export * from './getStableCandidatePools'
export * from './getCandidatePools'
