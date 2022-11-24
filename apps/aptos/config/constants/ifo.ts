import { testnetTokens } from './tokens'
import { Ifo } from './types'

// export const ifos: Ifo[] = []

export const ifos: Ifo[] = [
  {
    id: 'eth',
    cIFO: false,
    address: '',
    isActive: false,
    name: 'Moon',
    poolUnlimited: {
      saleAmount: '300,000,000 ETH',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.6,
    },
    currency: testnetTokens.cake,
    token: testnetTokens.eth,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'Moon description',
    vestingTitle: '$Moon - Moon vesting title.',
  },
  {
    id: 'test',
    cIFO: true,
    address: '',
    isActive: false,
    name: 'TEST',
    poolUnlimited: {
      saleAmount: '1 TEST',
      raiseAmount: '$1',
      cakeToBurn: '$0',
      distributionRatio: 0.6,
    },
    currency: testnetTokens.eth,
    token: testnetTokens.btc,
    releaseTime: 0,
    campaignId: '0',
    articleUrl: '',
    tokenOfferingPrice: 0.035,
    version: 3.2,
    twitterUrl: '',
    description: 'Test description',
    vestingTitle: '$TEST - test vesting title.',
  },
]
