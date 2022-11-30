import { testnetTokens } from './tokens'
import { Ifo } from './types'

export const ifos: Ifo[] = [
  {
    id: 'dai',
    cIFO: false,
    address:
      '0x6448039f3a6de9e862eb5b2347b583fab0c759c5e22ae1700d1b0569ee07b737::IFO::IFOPool<0xe0e5ad285cbcdb873b2ee15bb6bcac73d9d763bcb58395e894255eeecf3992cf::pancake::Cake, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetDAI, 0xb664f557c71de85be5cf91563961c5bb05345ba2b33f361533d2c184577185b7::uints::U1>',
    isActive: true,
    name: 'DAI',
    poolUnlimited: {
      saleAmount: '9 DAI',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: testnetTokens.cake,
    token: testnetTokens.dai,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 1,
    version: 3.2,
    twitterUrl: '',
    description: 'DAI description',
    vestingTitle: '$DAI -  vesting title.',
  },
]
