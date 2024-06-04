import { ChainId } from '@pancakeswap/chains'

export const AVERAGE_CHAIN_BLOCK_TIMES: Record<ChainId, number> = {
  [ChainId.BSC]: 3,
  [ChainId.BSC_TESTNET]: 3,
  [ChainId.OPBNB]: 1,
  [ChainId.OPBNB_TESTNET]: 1,
  [ChainId.ETHEREUM]: 12,
  [ChainId.GOERLI]: 3,
  [ChainId.POLYGON_ZKEVM]: 8,
  [ChainId.POLYGON_ZKEVM_TESTNET]: 8,
  [ChainId.ZKSYNC]: 3,
  [ChainId.ZKSYNC_TESTNET]: 3,
  [ChainId.ARBITRUM_ONE]: 1,
  [ChainId.ARBITRUM_GOERLI]: 1,
  [ChainId.SCROLL_SEPOLIA]: 1,
  [ChainId.LINEA]: 5,
  [ChainId.LINEA_TESTNET]: 2,
  [ChainId.BASE]: 3,
  [ChainId.BASE_TESTNET]: 3,
  [ChainId.ARBITRUM_SEPOLIA]: 0,
  [ChainId.BASE_SEPOLIA]: 0,
  [ChainId.SEPOLIA]: 0,
}
