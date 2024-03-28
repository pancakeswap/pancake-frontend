import { Token } from '@pancakeswap/sdk'
import { FeeAmount } from '../constants'
import { TickDataProvider } from '../entities'

export type PoolState = {
  token0: Token
  token1: Token
  fee: FeeAmount
  tick: number
  // sqrtPriceX96: bigint
  sqrtRatioX96: bigint
  liquidity: bigint
  tickDataProvider: TickDataProvider
}
