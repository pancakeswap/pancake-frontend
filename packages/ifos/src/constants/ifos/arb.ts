import { arbitrumTokens } from '@pancakeswap/tokens'

import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'test-arb',
    address: '0x661E2e222c0CD739ec5c7540506c999A2195290e',
    isActive: true,
    cIFO: false,
    name: 'Test',
    plannedStartTime: 1704369600, // Thu Jan 04 2024 12:00:00 UTC
    poolBasic: {
      raiseAmount: '$30,000',
    },
    poolUnlimited: {
      raiseAmount: '$270,000',
    },
    currency: arbitrumTokens.cake,
    token: arbitrumTokens.usdt,
    campaignId: '512300000',
    articleUrl:
      'https://pancakeswap.finance/voting/proposal/0x9c54bc5c0861dc3131459c9e434a63a146200ef7fa17ac5348373bb1e03a2cee?chain=bsc',
    tokenOfferingPrice: 1,
    version: 8,
    twitterUrl: 'https://twitter.com/Cakepiexyz_io',
    description:
      'Cakepie is a veCAKE Manager that boosts rewards for CAKE stakers and PancakeSwap’s liquidity providers, as part of the wider [veCAKE Ecosystem](https://docs.pancakeswap.finance/products/vecake/vecake-managers)',
    vestingTitle:
      'CKP is the primary token issued by Cakepie which can be locked for vlCKP (Vote-Locked Cakepie) at a 1:1 ratio.',
  },
]
