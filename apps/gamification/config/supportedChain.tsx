import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { arbitrumTokens, baseTokens, bscTokens, zksyncTokens } from '@pancakeswap/tokens'
import { arbitrum, base, bsc, zkSync } from 'wagmi/chains'

export const targetChains = [bsc, zkSync, arbitrum, base]

export const TOKEN_LIST: { [key in any]: Currency } = {
  [ChainId.BSC]: bscTokens,
  [ChainId.ZKSYNC]: zksyncTokens,
  [ChainId.ARBITRUM_ONE]: arbitrumTokens,
  [ChainId.BASE]: baseTokens,
}
