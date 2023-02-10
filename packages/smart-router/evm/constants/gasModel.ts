import { ChainId, Token } from '@pancakeswap/sdk'
import { ethereumTokens, bscTokens, bscTestnetTokens } from '@pancakeswap/tokens'

export const usdGasTokensByChain: { [chainId in ChainId]?: Token[] } = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
  [ChainId.BSC]: [bscTokens.busd],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.busd],
}
