import { polygonZkEvmTokens } from '@pancakeswap/tokens'

import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'test',
    address: '0x5539A7A6D2d5a0Ff35A833bD13bC35EF666fdFB3',
    isActive: true,
    name: 'USDT',
    plannedStartTime: 1691370000,
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
