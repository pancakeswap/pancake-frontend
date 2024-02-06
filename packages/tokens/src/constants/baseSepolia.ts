import { ChainId } from '@pancakeswap/chains'
import { WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const baseSepoliaTokens = {
  weth: WETH9[ChainId.BASE_SEPOLIA],
  usdc: USDC[ChainId.BASE_SEPOLIA],
}
