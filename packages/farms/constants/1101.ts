import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xD43b9dCbB61e6ccFbCFef9f21e1BB5064F1CB33f',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.usdc,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpAddress: '0x4A080D9488cE2C8258185d78852275D6d3c2820c',
    token0: polygonZkEvmTokens.usdt,
    token1: polygonZkEvmTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 3,
    lpAddress: '0xca06375be938a2d6eF311dfaFab7E326d55D23Cc',
    token0: polygonZkEvmTokens.usdt,
    token1: polygonZkEvmTokens.usdc,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 4,
    lpAddress: '0xaE30fcdEE41dC9eC265e841D8185d055B87d1B7a',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.matic,
    feeAmount: FeeAmount.MEDIUM,
  },
])

export default farmsV3
