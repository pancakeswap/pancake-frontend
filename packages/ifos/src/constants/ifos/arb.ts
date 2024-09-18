import { arbitrumTokens } from '@pancakeswap/tokens'
import { BaseIfoConfig } from '../../types'

export const ifos: BaseIfoConfig[] = [
  {
    id: 'testCrossChainIfo5',
    vestingTitle: 'testCrossChainIfo5',
    version: 8,

    address: '0x005a85F33354F07aA8C6ada3DFea8717876520f5', // Test IFO
    plannedStartTime: 1726646401,

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
  {
    id: 'testCrossChainIfo4',
    version: 8,

    address: '0x41cE6614F310315A43942fa6eCEdc19E93E50E63', // Test IFO
    plannedStartTime: 1726632000,

    isActive: false,
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
    vestingTitle: 'testCrossChainIfo4',
  },
  {
    id: 'testCrossChainIfo3',
    version: 8,

    address: '0xb7AdE79F9c517C9b3cc45E3522eBc4dCe1C54e7D', // Test IFO
    plannedStartTime: 1726552801,

    isActive: false,
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
    vestingTitle: 'testCrossChainIfo3',
  },
  {
    id: 'testCrossChainIfo2',
    version: 8,

    address: '0xD134a41Ac8c54bD8713F8B9307ded4FFF340E5C1', // Test IFO
    plannedStartTime: 1726466400,

    isActive: false,
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
    vestingTitle: 'testCrossChainIfo2',
  },
  {
    id: 'testCrossChainIfo1',
    version: 8,

    address: '0x7022f1335664D54C7D1bC22CFDa02f2C16CeEB7f', // Test IFO
    plannedStartTime: 1726236000,

    isActive: false,
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
    vestingTitle: 'testCrossChainIfo1',
  },
  {
    id: 'testCrossChainIfo0',
    version: 8,

    address: '0x6164B999597a6F30DA9aEF8A7F31D6dD7AE57e04', // Test IFO
    plannedStartTime: 1726207200,

    isActive: false,
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
    vestingTitle: 'testCrossChainIfo0',
  },
]
