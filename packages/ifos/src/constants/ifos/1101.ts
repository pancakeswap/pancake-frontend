import { polygonZkEvmTokens } from '@pancakeswap/tokens'

import { BaseIfoConfig } from '../../types'

// id should be unique across chains
export const ifos: BaseIfoConfig[] = [
  {
    id: '1101-test-2',
    address: '0x12FF161230Ec696d9E3D5f1678D0E2e0316371F3',
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
  {
    id: '1101-test',
    address: '0x38e0ad2aa59344f9752b2f60cb90e7cb7161758e',
    isActive: false,
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
