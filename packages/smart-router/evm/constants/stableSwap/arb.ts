import { arbitrumTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from './types'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'PENDLE-mPENDLE LP',
    lpAddress: '0x1A2329546f11e4fE55b853D98Bba2c4678E3105A',
    token: arbitrumTokens.pendle,
    quoteToken: arbitrumTokens.mpendle,
    stableSwapAddress: '0x73ed25e04Aa673ddf7411441098fC5ae19976CE0',
    infoStableSwapAddress: '0x58B2F00f74a1877510Ec37b22f116Bf5D63Ab1b0',
    stableLpFee: 0.0025,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
