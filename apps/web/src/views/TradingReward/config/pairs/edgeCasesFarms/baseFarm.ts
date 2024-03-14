import { defineFarmV3Configs } from '@pancakeswap/farms/src/defineFarmV3Configs'
import { baseTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardBaseV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0x03C33a2fC0D444a5B61E573f9e1A285357a694fc',
    token0: baseTokens.cake,
    token1: baseTokens.weth,
    feeAmount: FeeAmount.HIGH,
  },
])
