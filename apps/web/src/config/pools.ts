import { ChainId } from '@pancakeswap/sdk'

// Revalidate interval in milliseconds
export const POOLS_FAST_REVALIDATE = {
  [ChainId.BSC_TESTNET]: 10_000,
  [ChainId.BSC]: 10_000,
  [ChainId.ETHEREUM]: 20_000,
  [ChainId.GOERLI]: 20_000,
}

// Revalidate interval in milliseconds
export const POOLS_NORMAL_REVALIDATE = {
  [ChainId.BSC_TESTNET]: 15_000,
  [ChainId.BSC]: 15_000,
  [ChainId.ETHEREUM]: 20_000,
  [ChainId.GOERLI]: 20_000,
}

export const POOLS_SLOW_REVALIDATE = {
  [ChainId.BSC_TESTNET]: 20_000,
  [ChainId.BSC]: 20_000,
  [ChainId.ETHEREUM]: 40_000,
  [ChainId.GOERLI]: 40_000,
}
