import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'

export const dogechainTokens = {
  wdoge: WETH9[ChainId.DOGE],
  ice: new ERC20Token(ChainId.DOGE, '0x81bCEa03678D1CEF4830942227720D542Aa15817', 18, 'ICE', 'IceCream'),
  usdt: new ERC20Token(ChainId.DOGE, '0xD2683b22287E63D22928CBe4514003a92507f474', 18, 'USDT', 'Tether USD'),
}
