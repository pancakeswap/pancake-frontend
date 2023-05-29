import { ChainId, Token } from '@pancakeswap/sdk'
import {
  ethereumTokens,
  bscTokens,
  bscTestnetTokens,
  goerliTestnetTokens,
  polygonZkEvmTestnetTokens,
  zkSyncTestnetTokens,
  zksyncTokens,
  lineaTestnetTokens,
  arbitrumGoerliTokens,
} from '@pancakeswap/tokens'

export const usdGasTokensByChain = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
  [ChainId.GOERLI]: [goerliTestnetTokens.usdc],
  [ChainId.BSC]: [bscTokens.busd],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.busd],
  // TODO: new chains
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc],
} satisfies Record<ChainId, Token[]>

export * from './v2'
export * from './v3'
export * from './stableSwap'
