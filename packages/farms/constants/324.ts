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
  {
    pid: 3,
    lpAddress: '0x3832fB996C49792e71018f948f5bDdd987778424',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 4,
    lpAddress: '0xEae60Ff8Dd9F6896b94525CceDE1fca9994f73E4',
    token0: zksyncTokens.weth,
    token1: zksyncTokens.tes,
    feeAmount: FeeAmount.HIGH,
  },
])
