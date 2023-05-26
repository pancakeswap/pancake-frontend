import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDT } from './common'

export const polygonZkEvmTestnetTokens = {
  weth: WETH9[ChainId.POLYGON_ZKEVM_TESTNET],
  usdt: USDT[ChainId.POLYGON_ZKEVM_TESTNET],
}
