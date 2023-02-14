import { ChainId, Token } from '@pancakeswap/sdk'
import { ethereumTokens, bscTokens, bscTestnetTokens } from '@pancakeswap/tokens'

export const usdGasTokensByChain: { [chainId in ChainId]?: Token[] } = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
  [ChainId.BSC]: [bscTokens.busd],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.busd],
}

export const nativeWrappedTokenByChain: { [chainId in ChainId]?: Token } = {
  [ChainId.ETHEREUM]: ethereumTokens.weth,
  [ChainId.BSC]: bscTokens.wbnb,
  [ChainId.BSC_TESTNET]: bscTestnetTokens.wbnb,
}

export * from './v2'
export * from './v3'
