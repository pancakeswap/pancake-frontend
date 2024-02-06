import { WETH9, ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, CAKE } from './common'

export const arbitrumGoerliTokens = {
  weth: WETH9[ChainId.ARBITRUM_GOERLI],
  usdc: USDC[ChainId.ARBITRUM_GOERLI],
  cake: CAKE[ChainId.ARBITRUM_GOERLI],
  mockA: new ERC20Token(ChainId.ARBITRUM_GOERLI, '0x394d64eD40a6aF892D8562eE816D5e71D8999E52', 18, 'A', 'MOCK Token A'),
}
