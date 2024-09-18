import { arbitrumTokens } from '@pancakeswap/tokens'
import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'eigenpie',
    version: 8,

    address: '0x601a394e7A96C881AbeAB8Dc0ce9E7046afa765D',
    plannedStartTime: 1727172900,

    isActive: true,
    name: 'Eigenpie IFO',
    description:
      'Eigenpie is a Liquid Restaking Platform built on top of EigenLayer that allows users to restake their ETH or LSTs to validate new services while earning rewards and maintaining liquidity through LRTs',
    currency: arbitrumTokens.cake,
    token: arbitrumTokens.egp,
    articleUrl:
      'https://blog.pancakeswap.finance/articles/pancake-swap-launches-first-ifo-on-arbitrum-featuring-eigenpie?utm_source=Homepage&utm_medium=website&utm_campaign=Eigenpie&utm_id=IFO',
    campaignId: '',
    poolBasic: {
      raiseAmount: '$30,000',
      additionalClaimingFee: true,
    },
    poolUnlimited: {
      raiseAmount: '$30,000',
      additionalClaimingFee: true,
    },
    tokenOfferingPrice: 0.6,

    // Enable vestingTitle after IFO is moved to finished
    // vestingTitle: 'Eigenpie IFO',
  },
]
