import { PoolProvider, OnChainProvider, SubgraphProvider } from '../types'
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
