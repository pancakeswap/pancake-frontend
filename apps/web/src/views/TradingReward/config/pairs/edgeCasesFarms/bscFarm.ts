import { defineFarmV3Configs } from '@pancakeswap/farms/src/defineFarmV3Configs'
import { bscTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardBscV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0xfab21Cb9467e9BaDd22A2dE57BCDE5F53D925973',
    token0: bscTokens.usdt,
    token1: bscTokens.bnx,
    feeAmount: FeeAmount.LOW,
  },
])
