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
  {
    pid: 4,
    lpAddress: '0x7e928afb59f5dE9D2f4d162f754C6eB40c88aA8E',
    token0: arbitrumTokens.usdc,
    token1: arbitrumTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 5,
    lpAddress: '0xF5Fac36c2429e1Cf84D4aBACdB18477Ef32589c9',
    token0: arbitrumTokens.cake,
    token1: arbitrumTokens.weth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 6,
    lpAddress: '0xD58522653D3F368D76d453Bc4C80CD7Fb36AC786',
    token0: arbitrumTokens.weth,
    token1: arbitrumTokens.lvl,
    feeAmount: FeeAmount.MEDIUM,
  },
])
