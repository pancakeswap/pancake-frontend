import { ChainId, Token } from '@pancakeswap/sdk'
import { ethereumTokens, bscTokens, bscTestnetTokens, goerliTestnetTokens, zkSyncTestnetTokens, zksyncTokens, lineaTestnetTokens } from '@pancakeswap/tokens'

export const usdGasTokensByChain = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
  [ChainId.GOERLI]: [goerliTestnetTokens.usdc],
  [ChainId.BSC]: [bscTokens.busd],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.busd],
  // TODO: new chains
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.POLYGON_ZKEVM]: [],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc],
} satisfies Record<ChainId, Token[]>

export * from './v2'
export * from './v3'
export * from './stableSwap'
