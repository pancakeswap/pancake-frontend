import { arbitrumTokens } from '@pancakeswap/tokens'
import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'eigenpie',
    version: 8,

    address: '0xa6f907493269BEF3383fF0CBFd25e1Cc35167c3B',
    plannedStartTime: 1727172900,
    plannedEndTime: 1727259300,

    isActive: true,
    name: 'Eigenpie IFO',
    description:
      'Eigenpie is a Liquid Restaking Platform built on top of EigenLayer that allows users to restake their ETH or LSTs to validate new services while earning rewards and maintaining liquidity through LRTs',
    currency: arbitrumTokens.cake,
    token: arbitrumTokens.egp,
    articleUrl: 'https://forum.pancakeswap.finance/t/eigenpie-ifo-discussion-thread/778/1',
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
