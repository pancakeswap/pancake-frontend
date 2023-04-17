import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC, USDT } from './common'

export const polygonZkEvmTokens = {
  weth: WETH9[ChainId.POLYGON_ZKEVM],
  usdc: USDC[ChainId.POLYGON_ZKEVM],
  usdt: USDT[ChainId.POLYGON_ZKEVM],
}
