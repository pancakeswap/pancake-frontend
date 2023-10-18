import { WETH9, ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'

import { USDC, USDT } from './common'

export const scrollTokens = {
  weth: WETH9[ChainId.SCROLL],
  usdc: USDC[ChainId.SCROLL],
  usdt: USDT[ChainId.SCROLL],
  wbtc: new ERC20Token(ChainId.SCROLL, '0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1', 8, 'WBTC', 'Wrapped BTC'),
}
