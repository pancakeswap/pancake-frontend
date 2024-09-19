import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { goerliTestnetTokens } from '@pancakeswap/tokens'

import { BaseIfoConfig } from '../../types'

export const OFFERING_TOKEN = new ERC20Token(
  ChainId.GOERLI,
  '0x985d5915A01b83ad5eF42AB4FD16C3fe27F6A1C6',
  18,
  'MOC',
  'MOCK OC Token',
  'https://pancakeswap.finance/',
)

export const ifos: BaseIfoConfig[] = [
  {
    id: '1101-test-3',
    address: '0x6A70E184cb070df1F68c15934fC3C8B2EbDBAc29',
    isActive: false,
    name: 'USDT',
    plannedStartTime: 1699531200,
    poolBasic: {
      raiseAmount: '$0.4',
    },
    poolUnlimited: {
      raiseAmount: '$1.6',
    },
    currency: goerliTestnetTokens.cake,
    token: OFFERING_TOKEN,
    campaignId: '512200000',
    articleUrl: 'https://pancakeswap.finance/voting/',
    tokenOfferingPrice: 0.5782,
    version: 7,
    twitterUrl: 'https://twitter.com/pancakeswap',
    description: 'Spend CAKE LP, buy OF, but on vesting',
    vestingTitle: 'Use CAKE LP to buy OF',
  },
]
