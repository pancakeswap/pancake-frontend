import { defineFarmV3Configs } from '@pancakeswap/farms/src/defineFarmV3Configs'
import { bscTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardV3Pair = defineFarmV3Configs([
  {
    pid: null,
    lpAddress: '0x172fcD41E0913e95784454622d1c3724f546f849',
    token0: bscTokens.usdt,
    token1: bscTokens.wbnb,
    feeAmount: FeeAmount.LOWEST,
  },
])
