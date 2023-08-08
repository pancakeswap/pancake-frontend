import { polygonZkEvmTokens } from '@pancakeswap/tokens'

import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'test',
    address: '0x09287da58b99faa724057d6612519023f6323728',
    isActive: true,
    name: 'USDT',
    plannedStartTime: 1691474400,
    poolBasic: {
      raiseAmount: '$0.8',
    },
    poolUnlimited: {
      raiseAmount: '$3.2',
    },
    currency: polygonZkEvmTokens.cake,
    token: polygonZkEvmTokens.usdt,
    campaignId: '512200000',
    articleUrl: 'https://pancakeswap.finance/voting/',
    tokenOfferingPrice: 1.0,
    version: 7,
    twitterUrl: 'https://twitter.com/pancakeswap',
    description: 'Spend CAKE, buy USDT, but on vesting',
    vestingTitle: 'Use CAKE to buy USDT',
  },
]
