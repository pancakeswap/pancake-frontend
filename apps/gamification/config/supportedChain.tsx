import { ChainId } from '@pancakeswap/chains'
import { arbitrumTokens, baseTokens, bscTokens, zksyncTokens } from '@pancakeswap/tokens'
import { arbitrum, base, bsc, zkSync } from 'wagmi/chains'

export const targetChains = [bsc, zkSync, arbitrum, base]

export const TOKEN_LIST: { [key in string]: any } = {
  [ChainId.BSC]: bscTokens,
  [ChainId.ZKSYNC]: zksyncTokens,
  [ChainId.ARBITRUM_ONE]: arbitrumTokens,
  [ChainId.BASE]: baseTokens,
}
