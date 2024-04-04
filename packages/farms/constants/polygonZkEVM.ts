import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { FarmConfigV3 } from '../src'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

const v3TopFixedFarms: FarmConfigV3[] = [
  {
    pid: 15,
    lpAddress: '0x9f37552b87b68E7F169c442D595c1Be7A0F03b92',
    token0: polygonZkEvmTokens.weth,
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
    pid: 16,
    lpAddress: '0xb5d9E1622BFA6Efb3FB50c0bDc6a0EE2b2d046fA',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.wbtc,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 17,
    lpAddress: '0x7a816241EdaF060e33b774D6D3D6398485dFf9AF',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.matic,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 4,
    lpAddress: '0xaE30fcdEE41dC9eC265e841D8185d055B87d1B7a',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.matic,
    feeAmount: FeeAmount.MEDIUM,
  },
]

export const farmsV3 = defineFarmV3Configs([
  ...v3TopFixedFarms,
  {
    pid: 20,
    lpAddress: '0x160f3d3af6A2ECe5274AfD0925137e0387BAA5F2',
    token0: polygonZkEvmTokens.usdce,
    token1: polygonZkEvmTokens.grai,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 19,
    lpAddress: '0x3Fa1c450f3842C1252e4cB443e3F435b41D6f472',
    token0: polygonZkEvmTokens.cake,
    token1: polygonZkEvmTokens.weth,
    feeAmount: FeeAmount.HIGH,
  },
  {
    pid: 18,
    lpAddress: '0xb4BAB40e5a869eF1b5ff440a170A57d9feb228e9',
    token0: polygonZkEvmTokens.cake,
    token1: polygonZkEvmTokens.usdc,
    feeAmount: FeeAmount.HIGH,
  },

  {
    pid: 14,
    lpAddress: '0x435564Fb7E82daB83B2733D6Bc1fDB8B5a732DE8',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.rsETH,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 13,
    lpAddress: '0x2e780D6666C2C44754a0cA7A8e2Ed97506B47751',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.reth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 12,
    lpAddress: '0x3752BDb9215A2C0609d71407b50A528e1C6ECaBD',
    token0: polygonZkEvmTokens.weth,
    token1: polygonZkEvmTokens.wstETH,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 11,
    lpAddress: '0xf142d852c9c805e419399c9B3Ce2A8485F950BBf',
    token0: polygonZkEvmTokens.wstETH,
    token1: polygonZkEvmTokens.reth,
    feeAmount: FeeAmount.LOW,
  },
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
