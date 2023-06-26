import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDT, USDC } from './common'

export const arbitrumTokens = {
  weth: WETH9[ChainId.ARBITRUM_ONE],
  usdt: USDT[ChainId.ARBITRUM_ONE],
  usdc: USDC[ChainId.ARBITRUM_ONE],
}
