import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 8,
    lpAddress: '0xE0a5B3A014084B7E0fF6526986497629AEE16533',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.wstETH,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 9,
    lpAddress: '0x66f1320E9f77C6036a39C884E7fDC63F88e39E50',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.reth,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 10,
    lpAddress: '0xbAABf57B49eaa079523b29EC9D25879D82D17Dc6',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.rsETH,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 7,
    lpAddress: '0x849c0ae884bFDc14DDdeB7Cae95494f368414855',
    token0: polygonZkEvmTokens.usdce,
    token1: polygonZkEvmTokens.usdc,
    feeAmount: FeeAmount.LOWEST,
  },
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
  {
    pid: 5,
    lpAddress: '0x39aCc7cf02af19A1eB0e3628bA0F5C48f44beBF3',
    token0: polygonZkEvmTokens.usdc,
    token1: polygonZkEvmTokens.grai,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 6,
    lpAddress: '0xf1e501f74Ed9dc619be53Fddb698c94AbF9D56B6',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.wbtc,
    feeAmount: FeeAmount.LOW,
  },
])

export default farmsV3
