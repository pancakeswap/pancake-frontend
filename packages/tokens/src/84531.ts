import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const baseTestnetTokens = {
  weth: WETH9[ChainId.BASE_TESTNET],
  usdc: USDC[ChainId.BASE_TESTNET],
}
