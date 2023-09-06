import { baseTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
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
