import { baseTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
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
    pid: 6,
    lpAddress: '0x29Ed55B18Af0Add137952CB3E29FB77B32fCE426',
    token0: baseTokens.usdc,
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
  {
    pid: 2,
    lpAddress: '0xc0efC182479319ff258EcA420e2647cD82D3790c',
    token0: baseTokens.cbETH,
    token1: baseTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 1,
    lpAddress: '0xe58b73fF901325b8b2056B29712C50237242F520',
    token0: baseTokens.weth,
    token1: baseTokens.usdbc,
    feeAmount: FeeAmount.LOW,
  },
])
