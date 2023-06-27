import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const arbitrumGoerliTokens = {
  weth: WETH9[ChainId.ARBITRUM_GOERLI],
  usdc: USDC[ChainId.ARBITRUM_GOERLI],
}
