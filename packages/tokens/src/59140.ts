import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const lineaTestnetTokens = {
  weth: WETH9[ChainId.LINEA_TESTNET],
  usdc: USDC[ChainId.LINEA_TESTNET],
}
