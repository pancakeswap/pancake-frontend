import { defineFarmV3Configs } from '@pancakeswap/farms/src/defineFarmV3Configs'
import { degenTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardDegenV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0x03C33a2fC0D444a5B61E573f9e1A285357a694fc',
    token0: degenTokens.cake,
    token1: degenTokens.weth,
    feeAmount: FeeAmount.HIGH,
  },
])
