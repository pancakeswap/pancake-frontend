import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'

export const dokenTokens = {
  wdkn: WETH9[ChainId.DOKEN],
  ice: new ERC20Token(ChainId.DOKEN, '0x54051D9DbE99687867090d95fe15C3D3E35512Ba', 18, 'ICE', 'IceCream'),
  usdt: new ERC20Token(ChainId.DOKEN, '0x8e6dAa037b7F130020b30562f1E2a5D02233E6c5', 18, 'USDT', 'Tether USD'),
}
