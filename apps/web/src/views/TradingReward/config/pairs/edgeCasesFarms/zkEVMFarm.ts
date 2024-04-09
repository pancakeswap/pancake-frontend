import { defineFarmV3Configs } from '@pancakeswap/farms/src/defineFarmV3Configs'
import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardZkEvmV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0x3Fa1c450f3842C1252e4cB443e3F435b41D6f472',
    token0: polygonZkEvmTokens.cake,
    token1: polygonZkEvmTokens.weth,
    feeAmount: FeeAmount.HIGH,
  },
  {
    pid: null as any,
    lpAddress: '0xb4BAB40e5a869eF1b5ff440a170A57d9feb228e9',
    token0: polygonZkEvmTokens.cake,
    token1: polygonZkEvmTokens.usdc,
    feeAmount: FeeAmount.HIGH,
  },
])
