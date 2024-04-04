import { zksyncTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { FarmConfigV3 } from '../src'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

const v3TopFixedLps: FarmConfigV3[] = [
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
    pid: 18,
    lpAddress: '0x8126D76CE6d80C93E2E03c9E39a676Aea542c01D',
    token0: zksyncTokens.usdt,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 12,
    lpAddress: '0x6Ff6B5c5957606220C6Cd0422499c9c1224c399b',
    token0: zksyncTokens.usdt,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 3,
    lpAddress: '0x3832fB996C49792e71018f948f5bDdd987778424',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 6,
    lpAddress: '0x9cB8b12cb0223e105155318B72AdddA15D588fB9',
    token0: zksyncTokens.weth,
    token1: zksyncTokens.wbtc,
    feeAmount: FeeAmount.LOW,
  },
]

export const farmsV3 = defineFarmV3Configs([
  ...v3TopFixedLps,
  {
    pid: 22,
    lpAddress: '0xA9e8fb4462A4140a2cec9E4fcdFa592AA6B786Ed',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.grai,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 21,
    lpAddress: '0x6c94C8651063C1aA67f9C15284235a3D13cD383C',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.grai,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 20,
    lpAddress: '0x424594bD8B08E3F0c0e282B11Cc5817ae4eC47bf',
    token0: zksyncTokens.weth,
    token1: zksyncTokens.wethe,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 19,
    lpAddress: '0x9aFFdEe9004892624BFFebeB8EDBa4C980Fe6aCF',
    token0: zksyncTokens.weth,
    token1: zksyncTokens.wbtc,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 17,
    lpAddress: '0x374D5C205742AEbE2D9fe9B9741EFA7E12082234',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.dai,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 16,
    lpAddress: '0x3846400eEe47B29B5A6742620a29128A24921659',
    token0: zksyncTokens.usdt,
    token1: zksyncTokens.dai,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 15,
    lpAddress: '0xB3348f622e2d0F9053E08DA178445B80016c18Fb',
    token0: zksyncTokens.reth,
    token1: zksyncTokens.wstETH,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 14,
    lpAddress: '0x16B3Bbd346eB864eD28B99cf89dDe59aD31A034F',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.wstETH,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 13,
    lpAddress: '0x5631fE6d29E3CB717517DA05A9970e499DEF5e31',
    token0: zksyncTokens.weth,
    token1: zksyncTokens.wstETH,
    feeAmount: FeeAmount.LOW,
  },

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
    pid: 2,
    lpAddress: '0xFB467bedf483ef92D54b6615770eBEDD9F639a50',
    token0: zksyncTokens.usdc,
    token1: zksyncTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
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
    pid: 7,
    lpAddress: '0x662cD659F91528FF27D7Cb6Ac25e6EBA11c4003C',
    token0: zksyncTokens.busd,
    token1: zksyncTokens.usdc,
    feeAmount: FeeAmount.LOWEST,
  },
])
