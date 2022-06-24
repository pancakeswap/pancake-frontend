import { Token, ChainId } from '@pancakeswap/sdk'
import tokens from './tokens'
import farms from './farms'
import { Ifo } from './types'

export const cakeBnbLpToken = new Token(ChainId.MAINNET, farms[1].lpAddresses[ChainId.MAINNET], 18, farms[1].lpSymbol)

const ifos: Ifo[] = [
  {
    id: 'duet',
    address: '0xDF24BE326af4c1fb888f567f41D9a981A4752cf1',
    isActive: false,
    name: 'DUET',
    poolBasic: {
      saleAmount: '1,200,000 DUET',
      raiseAmount: '$360,000',
      cakeToBurn: '$0',
      distributionRatio: 0.2,
    },
    poolUnlimited: {
      saleAmount: '4,800,000 DUET',
      raiseAmount: '$1,440,000',
      cakeToBurn: '$0',
      distributionRatio: 0.8,
    },
    currency: tokens.cake,
    token: tokens.duet,
    releaseBlockNumber: null,
    campaignId: '511190000',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmXwoYYd8rkahVbxiGKsTa4rYRRFWPxhRGAHy3hVwK3Q2z',
    tokenOfferingPrice: 0.3,
    version: 3.1,
    telegramUrl: 'https://t.me/duetprotocol',
    twitterUrl: 'https://twitter.com/duetprotocol',
    description:
      'DUET Protocol is a multi-chain synthetic assets ecosystem, enabling pegged assets from various markets – from individual stocks, to indexes, ETFs, and commodities.',
  },
  
]

export default ifos
