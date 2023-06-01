import { ChainId } from '@pancakeswap/sdk'

// Revalidate interval in milliseconds
export const POOLS_FAST_REVALIDATE = {
  [ChainId.BSC_TESTNET]: 10_000,
  [ChainId.BSC]: 10_000,
  [ChainId.ETHEREUM]: 20_000,
  [ChainId.GOERLI]: 20_000,
  [ChainId.ARBITRUM_ONE]: 10_000,
  [ChainId.ARBITRUM_GOERLI]: 10_000,
  [ChainId.POLYGON_ZKEVM]: 15_000,
  [ChainId.POLYGON_ZKEVM_TESTNET]: 15_000,
  [ChainId.ZKSYNC]: 15_000,
  [ChainId.ZKSYNC_TESTNET]: 15_000,
  [ChainId.LINEA_TESTNET]: 20_000,
} as const satisfies Record<ChainId, number>

// Revalidate interval in milliseconds
export const POOLS_NORMAL_REVALIDATE = {
  [ChainId.BSC_TESTNET]: 15_000,
  [ChainId.BSC]: 15_000,
  [ChainId.ETHEREUM]: 20_000,
  [ChainId.GOERLI]: 20_000,
  [ChainId.ARBITRUM_ONE]: 15_000,
  [ChainId.ARBITRUM_GOERLI]: 15_000,
  [ChainId.POLYGON_ZKEVM]: 15_000,
  [ChainId.POLYGON_ZKEVM_TESTNET]: 15_000,
  [ChainId.ZKSYNC]: 15_000,
  [ChainId.ZKSYNC_TESTNET]: 15_000,
  [ChainId.LINEA_TESTNET]: 20_000,
} as const satisfies Record<ChainId, number>

export const POOLS_SLOW_REVALIDATE = {
  [ChainId.BSC_TESTNET]: 20_000,
  [ChainId.BSC]: 20_000,
  [ChainId.ETHEREUM]: 40_000,
  [ChainId.GOERLI]: 40_000,
  [ChainId.ARBITRUM_ONE]: 20_000,
  [ChainId.ARBITRUM_GOERLI]: 20_000,
  [ChainId.POLYGON_ZKEVM]: 20_000,
  [ChainId.POLYGON_ZKEVM_TESTNET]: 20_000,
  [ChainId.ZKSYNC]: 20_000,
  [ChainId.ZKSYNC_TESTNET]: 20_000,
  [ChainId.LINEA_TESTNET]: 30_000,
} as const satisfies Record<ChainId, number>
