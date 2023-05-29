import { Address } from 'viem'

export interface PoolSelectorConfig {
  topN: number
  topNDirectSwaps: number
  topNTokenInOut: number
  topNSecondHop: number
  topNWithEachBaseToken: number
  topNWithBaseToken: number
}

export interface PoolSelectorConfigChainMap {
  [chain: number]: PoolSelectorConfig
}

export interface TokenSpecificPoolSelectorConfig {
  [tokenAddress: Address]: Partial<PoolSelectorConfig>
}

export interface TokenPoolSelectorConfigChainMap {
  [chain: number]: TokenSpecificPoolSelectorConfig
}
