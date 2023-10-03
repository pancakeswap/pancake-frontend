import { WETH9, ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, CAKE } from './common'

export const baseTestnetTokens = {
  weth: WETH9[ChainId.BASE_TESTNET],
  usdc: USDC[ChainId.BASE_TESTNET],
  cake: CAKE[ChainId.BASE_TESTNET],
  mockA: new ERC20Token(ChainId.BASE_TESTNET, '0x15571d4a7D08e16108b97cf7c80Ffd5C3fcb9657', 18, 'A', 'Mock A'),
}
