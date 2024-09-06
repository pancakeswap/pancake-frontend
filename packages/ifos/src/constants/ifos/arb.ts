import { arbitrumTokens } from '@pancakeswap/tokens'
import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'testCrossChainIfo',
    version: 8,
    address: '0xE2aa2B60E3dD7BAA33587AaF21B68348A51460Eb',
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
    plannedStartTime: 1726358400,
  },
]
