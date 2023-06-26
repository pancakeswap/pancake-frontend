import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const zksyncTokens = {
  weth: WETH9[ChainId.ZKSYNC],
  usdc: USDC[ChainId.ZKSYNC],
}
