import { baseTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { FarmConfigV3 } from '../src'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

const v3TopFixedFarms: FarmConfigV3[] = [
  {
    pid: 10,
    lpAddress: '0x72AB388E2E2F6FaceF59E3C3FA2C4E29011c2D38',
    token0: baseTokens.weth,
    token1: baseTokens.usdc,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 9,
    lpAddress: '0xF6C0A374a483101e04EF5F7Ac9Bd15d9142BAC95',
    token0: baseTokens.weth,
    token1: baseTokens.usdbc,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 5,
    lpAddress: '0xB775272E537cc670C65DC852908aD47015244EaF',
    token0: baseTokens.weth,
    token1: baseTokens.usdc,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 1,
    lpAddress: '0xe58b73fF901325b8b2056B29712C50237242F520',
    token0: baseTokens.weth,
    token1: baseTokens.usdbc,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 6,
    lpAddress: '0x29Ed55B18Af0Add137952CB3E29FB77B32fCE426',
    token0: baseTokens.usdc,
    token1: baseTokens.usdbc,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 12,
    lpAddress: '0x257FCbAE4Ac6B26A02E4FC5e1a11e4174B5ce395',
    token0: baseTokens.cbETH,
    token1: baseTokens.weth,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 2,
    lpAddress: '0xc0efC182479319ff258EcA420e2647cD82D3790c',
    token0: baseTokens.cbETH,
    token1: baseTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
]

export const farmsV3 = defineFarmV3Configs([
  ...v3TopFixedFarms,
  {
    pid: 14,
    lpAddress: '0xBd59a718E60bd868123C6E949c9fd97185EFbDB7',
    token0: baseTokens.weth,
    token1: baseTokens.wstETH,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 13,
    lpAddress: '0x03C33a2fC0D444a5B61E573f9e1A285357a694fc',
    token0: baseTokens.cake,
    token1: baseTokens.weth,
    feeAmount: FeeAmount.HIGH,
  },

  {
    pid: 11,
    lpAddress: '0x25DEe2707979055245A18AE6a415bb7b1435Eb06',
    token0: baseTokens.usdbc,
    token1: baseTokens.axlusdc,
    feeAmount: FeeAmount.LOWEST,
  },

  {
    pid: 8,
    lpAddress: '0x0D486753B99b1e0548d3505D8B797c673b58Cad3',
    token0: baseTokens.tbtc,
    token1: baseTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 7,
    lpAddress: '0x345825A980BD94e1480bC4f20FE4e3DAE2F23Dd3',
    token0: baseTokens.dai,
    token1: baseTokens.usdc,
    feeAmount: FeeAmount.LOWEST,
  },

  {
    pid: 4,
    lpAddress: '0x9BFa331679b307Cf358438F45f6413a205FD3EBf',
    token0: baseTokens.weth,
    token1: baseTokens.dai,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 3,
    lpAddress: '0xe4eFf19c7AcE186ba39fD3eD639B2D34171f7efF',
    token0: baseTokens.dai,
    token1: baseTokens.usdbc,
    feeAmount: FeeAmount.LOWEST,
  },
])
