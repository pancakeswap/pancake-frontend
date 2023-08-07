import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const lineaTokens = {
  weth: WETH9[ChainId.LINEA],
  usdc: USDC[ChainId.LINEA],
}
