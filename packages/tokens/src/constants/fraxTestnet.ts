import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { CAKE, USDC, USDT } from './common'

export const fraxTestnetTokens = {
  weth: WETH9[ChainId.FRAX_TESTNET],
  cake: CAKE[ChainId.BSC_TESTNET],
  usdc: USDC[ChainId.FRAX_TESTNET],
  usdt: USDT[ChainId.FRAX_TESTNET],
}
