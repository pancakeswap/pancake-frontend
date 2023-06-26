import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const zkSyncTestnetTokens = {
  weth: WETH9[ChainId.ZKSYNC_TESTNET],
  usdc: USDC[ChainId.ZKSYNC_TESTNET],
}
