import { PoolProvider, OnChainProvider } from '../types'
import { createHybridPoolProvider } from './hybridPoolProvider'

interface Config {
  onChainProvider: OnChainProvider
}

// For evm
export function createPoolProvider({ onChainProvider }: Config): PoolProvider {
  const hybridPoolProvider = createHybridPoolProvider(onChainProvider)
  return hybridPoolProvider
}
