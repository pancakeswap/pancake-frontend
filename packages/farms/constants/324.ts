import { zksyncTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0x291d9F9764c72C9BA6fF47b451a9f7885Ebf9977',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpAddress: '0xFB467bedf483ef92D54b6615770eBEDD9F639a50',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
])
