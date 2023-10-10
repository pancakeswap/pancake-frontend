import { polygonZkEvmTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xae62072e5e25fE2D811Da7e4E33F75E0524B8FdC',
    token0: polygonZkEvmTestnetTokens.weth,
    token1: polygonZkEvmTestnetTokens.mockA,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpAddress: '0xfc45871d6c0Df3CDAE736dB52B2d81ac61EcF6eF',
    token0: polygonZkEvmTestnetTokens.weth,
    token1: polygonZkEvmTestnetTokens.mockB,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 3,
    lpAddress: '0x9c7505095aA5a1B2227822BA47D13054eC570972',
    token0: polygonZkEvmTestnetTokens.mockB,
    token1: polygonZkEvmTestnetTokens.mockC,
    feeAmount: FeeAmount.HIGH,
  },
])
