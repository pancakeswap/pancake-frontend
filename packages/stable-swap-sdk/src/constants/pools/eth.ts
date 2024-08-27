import { ethereumTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from '../../types'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'WBTC-mBTC LP',
    lpAddress: '0xaB9dEBAED21270832cCdf54a7461A8E4B133B57A',
    token: ethereumTokens.wbtc,
    quoteToken: ethereumTokens.mBtc,
    stableSwapAddress: '0x95A3832889B2c3455077991b834efA2d4fA3A945',
    infoStableSwapAddress: '0xCcd9fea6bBF1910F4c188A5BBC13D98Ea4F5f9F9',
    stableTotalFee: 0.0002,
    stableLpFee: 0.0001,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
