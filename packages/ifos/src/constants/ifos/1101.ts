import { polygonZkEvmTokens } from '@pancakeswap/tokens'

import { BaseIfoConfig } from '../../types'

// id should be unique across chains
export const ifos: BaseIfoConfig[] = [
  {
    id: '1101-test-2',
    address: '0x0afc9aebc7e48a9fce65dfe94d785a9bbd4697de',
    isActive: true,
    name: 'USDT',
    plannedStartTime: 1692327600,
    poolBasic: {
      raiseAmount: '$0.4',
    },
    poolUnlimited: {
      raiseAmount: '$1.6',
    },
    currency: polygonZkEvmTokens.cake,
    token: polygonZkEvmTokens.matic,
    campaignId: '512200000',
    articleUrl: 'https://pancakeswap.finance/voting/',
    tokenOfferingPrice: 0.5782,
    version: 7,
    twitterUrl: 'https://twitter.com/pancakeswap',
    description: 'Spend CAKE, buy USDT, but on vesting',
    vestingTitle: 'Use CAKE to buy USDT',
  },
]
