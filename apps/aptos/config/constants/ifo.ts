import { getIFOUID, IFO_POOL_STORE_TAG } from 'views/Ifos/constants'
import { mainnetTokens } from './tokens'
import { Ifo } from './types'

export const ifos: Ifo[] = [
  {
    id: 'BNB',
    cIFO: false,
    address: `${IFO_POOL_STORE_TAG}<${mainnetTokens.cake.address}, ${mainnetTokens.bnb.address}, ${getIFOUID(1)}>`,
    isActive: true,
    name: 'BNB',
    poolUnlimited: {
      saleAmount: '9 BNB',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: mainnetTokens.cake,
    token: mainnetTokens.bnb,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'BNB description',
    vestingTitle: '$BNB - usdc vesting title.',
  },
]
