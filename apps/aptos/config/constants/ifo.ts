import { getIFOUID, IFO_POOL_STORE_TAG } from 'views/Ifos/constants'
import { testnetTokens } from './tokens'
import { Ifo } from './types'

export const ifos: Ifo[] = [
  {
    id: 'USDC',
    cIFO: false,
    address: `${IFO_POOL_STORE_TAG}<${testnetTokens.cake.address}, ${testnetTokens.usdc.address}, ${getIFOUID(1)}>`,
    isActive: true,
    name: 'USDC',
    poolUnlimited: {
      saleAmount: '9 USDC',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: testnetTokens.cake,
    token: testnetTokens.usdc,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'USDC description',
    vestingTitle: '$USDC - USDC vesting title.',
  },
  {
    id: 'DAI',
    cIFO: false,
    address: `${IFO_POOL_STORE_TAG}<${testnetTokens.cake.address}, ${testnetTokens.dai.address}, ${getIFOUID(1)}>`,
    isActive: false,
    name: 'DAI',
    poolUnlimited: {
      saleAmount: '9 DAI',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: testnetTokens.cake,
    token: testnetTokens.dai,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'SOL description',
    vestingTitle: '$DAI - DAI vesting title.',
  },
]
