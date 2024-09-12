import { arbitrumTokens } from '@pancakeswap/tokens'
import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'testCrossChainIfo',
    version: 8,

    address: '0xd78609547DB71b35D2494377Dc93459924a4D634', // Test IFO
    plannedStartTime: 1726135200,

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
