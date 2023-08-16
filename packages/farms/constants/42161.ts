import { arbitrumTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xd9e2a1a61B6E61b275cEc326465d417e52C1b95c',
    token0: arbitrumTokens.weth,
    token1: arbitrumTokens.usdc,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpAddress: '0x0BaCc7a9717e70EA0DA5Ac075889Bd87d4C81197',
    token0: arbitrumTokens.weth,
    token1: arbitrumTokens.usdt,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 3,
    lpAddress: '0x0d7c4b40018969f81750d0a164c3839a77353EFB',
    token0: arbitrumTokens.weth,
    token1: arbitrumTokens.arb,
    feeAmount: FeeAmount.LOW,
  },
])
