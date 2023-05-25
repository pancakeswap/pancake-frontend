import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC, USDT } from './common'

export const polygonZkEvmTestnetTokens = {
  weth: WETH9[ChainId.POLYGON_ZKEVM_TESTNET],
  usdc: USDC[ChainId.POLYGON_ZKEVM_TESTNET],
  usdt: USDT[ChainId.POLYGON_ZKEVM_TESTNET],
}
