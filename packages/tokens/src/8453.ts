import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, CAKE } from './common'

export const baseTokens = {
  weth: WETH9[ChainId.BASE],
  usdc: USDC[ChainId.BASE],
  cake: CAKE[ChainId.BASE],
  cbETH: new ERC20Token(
    ChainId.BASE,
    '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    18,
    'cbETH',
    'Coinbase Wrapped Staked ETH',
  ),
  usdbc: new ERC20Token(ChainId.BASE, '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', 6, 'USDbC', 'USD Base Coin'),
  dai: new ERC20Token(ChainId.BASE, '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', 18, 'DAI', 'Dai Stablecoin'),
  tbtc: new ERC20Token(ChainId.BASE, '0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b', 18, 'tBTC', 'Base tBTC v2'),
}
