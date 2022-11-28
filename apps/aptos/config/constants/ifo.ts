import { testnetTokens } from './tokens'
import { Ifo } from './types'

export const ifos: Ifo[] = [
  {
    id: 'btc',
    cIFO: false,
    address:
      '0xaec55cf0445a1d93fc3eb2b499227aa6199cdad3b83ba2b3907d6129cac2e19a::IFO::IFOPool<0xe0e5ad285cbcdb873b2ee15bb6bcac73d9d763bcb58395e894255eeecf3992cf::pancake::Cake, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0xb664f557c71de85be5cf91563961c5bb05345ba2b33f361533d2c184577185b7::uints::U1>',
    isActive: true,
    name: 'BTC',
    poolUnlimited: {
      saleAmount: '9 BTC',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: testnetTokens.cake,
    token: testnetTokens.btc,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'Moon description',
    vestingTitle: '$BNB - BNB vesting title.',
  },
  {
    id: 'bnb',
    cIFO: false,
    address:
      '0xaec55cf0445a1d93fc3eb2b499227aa6199cdad3b83ba2b3907d6129cac2e19a::IFO::IFOPool<0xe0e5ad285cbcdb873b2ee15bb6bcac73d9d763bcb58395e894255eeecf3992cf::pancake::Cake, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBNB, 0xb664f557c71de85be5cf91563961c5bb05345ba2b33f361533d2c184577185b7::uints::U1>',
    isActive: false,
    name: 'BNB',
    poolUnlimited: {
      saleAmount: '300,000,000 BNB',
      raiseAmount: '$123,456',
      cakeToBurn: '$0',
      distributionRatio: 0.6,
    },
    currency: testnetTokens.cake,
    token: testnetTokens.bnb,
    releaseTime: 0,
    campaignId: '1',
    articleUrl: '',
    tokenOfferingPrice: 0.00004939,
    version: 3.2,
    twitterUrl: '',
    description: 'Moon description',
    vestingTitle: '$BNB - BNB vesting title.',
  },
]
