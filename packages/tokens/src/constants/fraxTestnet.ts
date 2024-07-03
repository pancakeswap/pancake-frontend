import { ChainId } from '@pancakeswap/chains'
import { WETH9 } from '@pancakeswap/sdk'
import { USDC, USDT } from './common'

export const fraxTestnetTokens = {
  wfrxeth: WETH9[ChainId.FRAX_TESTNET],
  usdc: USDC[ChainId.FRAX_TESTNET],
  usdt: USDT[ChainId.FRAX_TESTNET],
}
