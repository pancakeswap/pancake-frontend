import { ChainId } from '@pancakeswap/sdk'

// @see https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids
export const LZ_CHAIN_MAP = {
  [ChainId.ETHEREUM]: 101,
  [ChainId.BSC]: 102,
  [ChainId.POLYGON_ZKEVM]: 158,
  [ChainId.ZKSYNC]: 165,
  [ChainId.ARBITRUM_ONE]: 110,
} as const
