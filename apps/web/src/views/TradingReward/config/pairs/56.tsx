import { FarmConfigV3 } from '@pancakeswap/farms/src'
import { bscTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardV3Pair = [
  {
    pid: null,
    lpSymbol: 'USDT-BNB LP',
    lpAddress: '0x172fcD41E0913e95784454622d1c3724f546f849',
    token: bscTokens.usdt,
    quoteToken: bscTokens.wbnb,
    feeAmount: FeeAmount.LOWEST,
  },
] satisfies FarmConfigV3[]
