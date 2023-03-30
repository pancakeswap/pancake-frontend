import { ChainId, ERC20Token, WETH9 } from '@pancakeswap/sdk'

import { USDC_GOERLI } from './common'

export const goerliTestnetTokens = {
  weth: WETH9[ChainId.GOERLI],
  celr: new ERC20Token(ChainId.GOERLI, '0x5D3c0F4cA5EE99f8E8F59Ff9A5fAb04F6a7e007f', 18, 'CELR', 'CelerToken', ''),
  leet: new ERC20Token(ChainId.GOERLI, '0xBd509651E6374c327d24b9d7E3Ea46704f6F31E8', 18, 'LEET', 'Leet Token', ''),
  usdc: USDC_GOERLI,
  mockB: new ERC20Token(ChainId.GOERLI, '0xB8DA084D035C9c38518D86A9D079ba6A0Aec4327', 18, 'MOCK B', 'MOCK B'),
  mockA: new ERC20Token(ChainId.GOERLI, '0xD134B434682dF091E398a844Dc3c613fe728cE2D', 18, 'MOCK A', 'MOCK A'),
}
