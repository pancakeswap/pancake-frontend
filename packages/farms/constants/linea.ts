import { lineaTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xd5539D0360438a66661148c633A9F0965E482845',
    token0: lineaTokens.usdc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpAddress: '0x6a72F4F191720c411Cd1fF6A5EA8DeDEC3A64771',
    token0: lineaTokens.usdc,
    token1: lineaTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 3,
    lpAddress: '0xbD3bc396C9393e63bBc935786Dd120B17F58Df4c',
    token0: lineaTokens.wbtc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 4,
    lpAddress: '0xA48E0630B7b9dCb250112143C9D0fe47d26CB1e4',
    token0: lineaTokens.usdc,
    token1: lineaTokens.dai,
    feeAmount: FeeAmount.LOWEST,
  },
])
