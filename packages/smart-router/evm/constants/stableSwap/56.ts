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
  {
    lpSymbol: 'USDT-BUSD LP',
    lpAddress: '0x36842F8fb99D55477C0Da638aF5ceb6bBf86aA98',
    token: bscTokens.usdt,
    quoteToken: bscTokens.busd,
    stableSwapAddress: '0x169F653A54ACD441aB34B73dA9946e2C451787EF',
    infoStableSwapAddress: '0xa680d27f63Fa5E213C502d1B3Ca1EB6a3C1b31D6',
  },
  {
    lpSymbol: 'USDC-BUSD LP',
    lpAddress: '0x1A77C359D0019cD8F4d36b7CDf5a88043D801072',
    token: bscTokens.usdc,
    quoteToken: bscTokens.busd,
    stableSwapAddress: '0xc2F5B9a3d9138ab2B74d581fC11346219eBf43Fe',
    infoStableSwapAddress: '0xa680d27f63Fa5E213C502d1B3Ca1EB6a3C1b31D6',
  },
  {
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0xee1bcc9F1692E81A281b3a302a4b67890BA4be76',
    token: bscTokens.usdt,
    quoteToken: bscTokens.usdc,
    stableSwapAddress: '0x3EFebC418efB585248A0D2140cfb87aFcc2C63DD',
    infoStableSwapAddress: '0xa680d27f63Fa5E213C502d1B3Ca1EB6a3C1b31D6',
  },
]
