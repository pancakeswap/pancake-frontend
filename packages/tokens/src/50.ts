import {ChainId, ERC20Token, WETH9} from '@pancakeswap/sdk'

export const xdcTokens = {
  wxdc: WETH9[ChainId.XDC],
  ice: new ERC20Token(ChainId.XDC, '0x54051D9DbE99687867090d95fe15C3D3E35512Ba', 18, 'ICE', 'IceCream'),
  usdt: new ERC20Token(ChainId.XDC, '0xc57F0eb99363e747D637B17BBdB4e1AB85e60631', 18, 'USDT', 'Tether USD'),
  usdc: new ERC20Token(ChainId.XDC, '0xB25cB6a275a8D6a613228FB161eB3627b50EB696', 18, 'USDC', 'USD Coin'),
}
