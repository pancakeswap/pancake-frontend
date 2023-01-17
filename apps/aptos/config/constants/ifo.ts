import { getIFOUID, IFO_POOL_STORE_TAG } from 'views/Ifos/constants'
import { mainnetTokens } from './tokens/1'
import { Ifo } from './types'

export const ifos: Ifo[] = [
  {
    id: 'DAI',
    cIFO: false,
    address: `${IFO_POOL_STORE_TAG}<${mainnetTokens.busd.address}, ${mainnetTokens.dai.address}, ${getIFOUID(1)}>`,
    isActive: true,
    name: 'DAI',
    poolUnlimited: {
      saleAmount: '9 DAI',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: mainnetTokens.busd,
    token: mainnetTokens.dai,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'DAI description',
    vestingTitle: '$DAI - DAI vesting title.',
  },
  {
    id: 'BUSD',
    cIFO: false,
    address: `${IFO_POOL_STORE_TAG}<${mainnetTokens.usdt.address}, ${mainnetTokens.busd.address}, ${getIFOUID(1)}>`,
    isActive: false,
    name: 'BUSD',
    poolUnlimited: {
      saleAmount: '9 BUSD',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: mainnetTokens.usdt,
    token: mainnetTokens.busd,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'BUSD description',
    vestingTitle: '$BUSD - BUSD vesting title.',
  },
]
