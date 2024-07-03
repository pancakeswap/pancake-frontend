import { fraxTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0x2fB36a4B80baC9803E42a2e312fbE527A01156e9', // PancakeV3Factory
    token0: fraxTestnetTokens.usdt,
    token1: fraxTestnetTokens.usdc,
    feeAmount: FeeAmount.LOW,
  },
])
