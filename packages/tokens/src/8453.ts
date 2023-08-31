import { ChainId, ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const baseTokens = {
  weth: WETH9[ChainId.BASE],
  usdc: USDC[ChainId.BASE],
  cbETH: new ERC20Token(
    ChainId.BASE,
    '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    18,
    'cbETH',
    'Coinbase Wrapped Staked ETH',
  ),
}
