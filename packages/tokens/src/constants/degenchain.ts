import { ChainId } from '@pancakeswap/chains'
import { WETH9 } from '@pancakeswap/sdk'
import { CAKE, USDT } from './common'

export const degenTokens = {
  weth: WETH9[ChainId.DEGENCHAIN],
  cake: CAKE[ChainId.DEGENCHAIN],
  usdt: USDT[ChainId.DEGENCHAIN],
}
