import { getIFOUID, IFO_POOL_STORE_TAG } from 'views/Ifos/constants'
import { mainnetTokens } from './tokens/1'
import { Ifo } from './types'

export const ifos: Ifo[] = [
  {
    id: 'lzUSDT',
    cIFO: false,
    address: `${IFO_POOL_STORE_TAG}<${mainnetTokens.cake.address}, ${mainnetTokens.lzusdt.address}, ${getIFOUID(1)}>`,
    isActive: true,
    name: 'lzUSDT',
    poolUnlimited: {
      saleAmount: '10 lzUSDT',
      raiseAmount: '$10',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: mainnetTokens.cake,
    token: mainnetTokens.lzusdt,
    releaseTime: 1674921023,
    articleUrl:
      'https://pancakeswap.finance/voting/proposal/0x06598b682d9f33ec5ea0c2acf8eba13dea7c63fa08dd2c4dfd7bc7af16920d51',
    tokenOfferingPrice: 4,
    version: 3.2,
    twitterUrl: '',
    description: 'lzUSDT description',
    vestingTitle: '$lzUSDT - lzUSDT vesting title.',
  },
]
