import { bscTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from '../../types/pool'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'HAY-BUSD LP',
    lpAddress: '0xB6040A9F294477dDAdf5543a24E5463B8F2423Ae',
    token: bscTokens.hay,
    quoteToken: bscTokens.busd,
    stableSwapAddress: '0x49079d07ef47449af808a4f36c2a8dec975594ec',
    infoStableSwapAddress: '0xa680d27f63Fa5E213C502d1B3Ca1EB6a3C1b31D6',
  },
]
