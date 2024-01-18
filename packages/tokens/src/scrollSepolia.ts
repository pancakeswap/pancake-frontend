import { WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC } from './common'

export const scrollSepoliaTokens = {
  weth: WETH9[ChainId.SCROLL_SEPOLIA],
  usdc: USDC[ChainId.SCROLL_SEPOLIA],
}
