import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'
import { USDC, USDT, CAKE } from './common'

export const zksyncTokens = {
  weth: WETH9[ChainId.ZKSYNC],
  usdc: USDC[ChainId.ZKSYNC],
  usdt: USDT[ChainId.ZKSYNC],
  cake: CAKE[ChainId.ZKSYNC],
  tes: new ERC20Token(
    ChainId.ZKSYNC,
    '0xCab3F741Fa54e79E34753B95717b23018332b8AC',
    18,
    'TES',
    'Tiny Era Shard',
    'https://tinyworlds.io/',
  ),
}
