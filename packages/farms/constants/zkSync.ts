import { zksyncTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 11,
    lpAddress: '0x6a8Fc7e8186ddC572e149dFAa49CfAE1E571108b',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.usdPlus,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 10,
    lpAddress: '0x3693Ec2590e6bF8F221F61776dC9274AED7056D6',
    token0: zksyncTokens.reth,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 9,
    lpAddress: '0x38848d93a410446848CA55Fdc777Fe0B2C30B071',
    token0: zksyncTokens.busd,
    token1: zksyncTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 8,
    lpAddress: '0x7C0e7D6066aF191977a4483B445B5C06FC41ECd6',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.LOWEST,
  },
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
  {
    pid: 5,
    lpAddress: '0x3c11CAACc9FC70d9130792c39702C5F96cE68a93',
    token0: zksyncTokens.cake,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 6,
    lpAddress: '0x9cB8b12cb0223e105155318B72AdddA15D588fB9',
    token0: zksyncTokens.weth,
    token1: zksyncTokens.wbtc,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 7,
    lpAddress: '0x662cD659F91528FF27D7Cb6Ac25e6EBA11c4003C',
    token0: zksyncTokens.busd,
    token1: zksyncTokens.usdc,
    feeAmount: FeeAmount.LOWEST,
  },
])
