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
    lpAddress: '0x0FAd022b08FBdBd81A45013131B94Aa223E868eE',
    token: arbitrumTokens.mBtc,
    quoteToken: arbitrumTokens.wbtc,
    stableSwapAddress: '0x5025Ee0cBceD7f44dbA9d30DCba10De49aa56D11',
    infoStableSwapAddress: '0x58B2F00f74a1877510Ec37b22f116Bf5D63Ab1b0',
    stableTotalFee: 0.00025,
    stableLpFee: 0.000125,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
