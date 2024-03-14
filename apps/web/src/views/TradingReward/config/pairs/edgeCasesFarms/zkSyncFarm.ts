import { defineFarmV3Configs } from '@pancakeswap/farms/src/defineFarmV3Configs'
import { zksyncTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardZkSyncV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0x424594bD8B08E3F0c0e282B11Cc5817ae4eC47bf',
    token0: zksyncTokens.wethe,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
])
