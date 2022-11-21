import { testnetTokens } from './tokens'
import { Ifo } from './types'

// export const ifos: Ifo[] = []

export const ifos: Ifo[] = [
  {
    id: 'test',
    cIFO: true,
    address: '',
    isActive: true,
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
