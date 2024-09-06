import { arbitrumTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from '../../types'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'PENDLE-mPENDLE LP',
    lpAddress: '0x1A2329546f11e4fE55b853D98Bba2c4678E3105A',
    token: arbitrumTokens.pendle,
    quoteToken: arbitrumTokens.mpendle,
    stableSwapAddress: '0x73ed25e04Aa673ddf7411441098fC5ae19976CE0',
    infoStableSwapAddress: '0x58B2F00f74a1877510Ec37b22f116Bf5D63Ab1b0',
    stableTotalFee: 0.0025,
    stableLpFee: 0.00125,
    stableLpFeeRateOfTotalFee: 0.5,
  },
  {
    lpSymbol: 'DLP-mDLP LP',
    lpAddress: '0x0db5e247ab73FBaE16d9301f2977f974EC0AA336',
    token: arbitrumTokens.dlp,
    quoteToken: arbitrumTokens.mdlp,
    stableSwapAddress: '0xd0f0be815a76eFE677c92b07b39a5e972BAf22bD',
    infoStableSwapAddress: '0x58B2F00f74a1877510Ec37b22f116Bf5D63Ab1b0',
    stableTotalFee: 0.0025,
    stableLpFee: 0.00125,
    stableLpFeeRateOfTotalFee: 0.5,
  },
  {
    lpSymbol: 'mBTC-WBTC LP',
    lpAddress: '0x893c6d8b83726df868C1426f71c46Ba479ba3cC8',
    token: arbitrumTokens.mBtc,
    quoteToken: arbitrumTokens.wbtc,
    stableSwapAddress: '0xE80bD6fE6CB209E5546153AF19F151a3e651FA57',
    infoStableSwapAddress: '0x58B2F00f74a1877510Ec37b22f116Bf5D63Ab1b0',
    stableTotalFee: 0.0002,
    stableLpFee: 0.0001,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
