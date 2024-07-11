import { defineFarmV3Configs } from '@pancakeswap/farms/src/defineFarmV3Configs'
import { bscTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

export const tradingRewardBscV3Pair = defineFarmV3Configs([
  {
    pid: null as any,
    lpAddress: '0xfab21Cb9467e9BaDd22A2dE57BCDE5F53D925973',
    token0: bscTokens.usdt,
    token1: bscTokens.bnx,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: null as any,
    lpAddress: '0x247f51881d1E3aE0f759AFB801413a6C948Ef442',
    token0: bscTokens.usdt,
    token1: bscTokens.btcb,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: null as any,
    lpAddress: '0xAfB2Da14056725E3BA3a30dD846B6BBbd7886c56',
    token0: bscTokens.cake,
    token1: bscTokens.wbnb,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: null as any,
    lpAddress: '0x1936be860d93B0Ff98f3a9b83254D61A78930B76',
    token0: bscTokens.raca,
    token1: bscTokens.usdt,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: null as any,
    lpAddress: '0x6a4116345bD9446aF758000476b144Cf5da626C0',
    token0: bscTokens.dao,
    token1: bscTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: null as any,
    lpAddress: '0x7eb6B5Ab4a075071e339e09d4f665A91B6007745',
    token0: bscTokens.raca,
    token1: bscTokens.wbnb,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: null as any,
    lpAddress: '0x4f31Fa980a675570939B737Ebdde0471a4Be40Eb',
    token0: bscTokens.usdt,
    token1: bscTokens.usdc,
    feeAmount: FeeAmount.LOW,
  },
])
