import { arbitrumTokens } from '@pancakeswap/tokens'
import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'testCrossChainIfo',
    version: 8,

    address: '0x6164B999597a6F30DA9aEF8A7F31D6dD7AE57e04', // Test IFO
    plannedStartTime: 1726207200,

    isActive: true,
    name: 'Test Arbitrum IFO',
    description: 'This is an IFO on Arbitrum to test cross-chain IFOs functionality on PancakeSwap.',
    currency: arbitrumTokens.cake,
    token: arbitrumTokens.usdc,
    articleUrl: 'https://pancakeswap.medium.com/',
    campaignId: 'random-for-testing',
    poolBasic: {
      raiseAmount: '$10,000',
    },
    poolUnlimited: {
      raiseAmount: '$90,000',
      additionalClaimingFee: false,
    },
    tokenOfferingPrice: 0.1,
  },
]
