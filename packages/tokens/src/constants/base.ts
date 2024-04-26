import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { CAKE, USDC, USDT } from './common'

export const baseTokens = {
  weth: WETH9[ChainId.PULSECHAIN],
  usdc: USDC[ChainId.PULSECHAIN],
  cake: CAKE[ChainId.PULSECHAIN],
  cbETH: new ERC20Token(ChainId.PULSECHAIN, '0x93Cf7d72333Fe9faEb9D455b82A4c85D7F0609aa', 18, 'PEPPA', 'PEPPA'),
  usdbc: USDT[ChainId.PULSECHAIN],
  dai: new ERC20Token(
    ChainId.PULSECHAIN,
    '0xefD766cCb38EaF1dfd701853BFCe31359239F305',
    18,
    'DAI',
    'Dai Stablecoin',
    'https://www.makerdao.com/',
  ),
  tbtc: new ERC20Token(ChainId.PULSECHAIN, '0x74D98E37132dF921dF38c5A2Ae8748aDbab63238', 18, 'NANANA', 'Nanana', ''),
  axlusdc: new ERC20Token(ChainId.PULSECHAIN, '0x8BDB63033b02C15f113De51EA1C3a96Af9e8ecb5', 18, 'AXIS', 'AXIS', ''),
  wstETH: new ERC20Token(ChainId.PULSECHAIN, '0x0dEEd1486bc52aA0d3E6f8849cEC5adD6598A162', 18, 'USDL', 'USDL', ''),
}
