import { Pair } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { mainnetTokens } from '../tokens/index'

const farms: SerializedFarmConfig[] = [
  /**
   * These farms should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'lzUSDC-lzUSDT LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>',
    token: mainnetTokens.lzusdt,
    quoteToken: mainnetTokens.lzusdc,
  },
  {
    pid: 2,
    lpSymbol: 'APT-lzUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    token: mainnetTokens.lzusdc,
    quoteToken: mainnetTokens.apt,
  },
  // * By order of release
  {
    pid: 4,
    lpSymbol: 'ceBNB-ceUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin, 0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>',
    token: mainnetTokens.ceusdc,
    quoteToken: mainnetTokens.cebnb,
  },
  {
    pid: 3,
    lpSymbol: 'whUSDC-whBUSD LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xccc9620d38c4f3991fa68a03ad98ef3735f18d04717cb75d7a1300dd8a7eed75::coin::T>',
    token: mainnetTokens.whbusd,
    quoteToken: mainnetTokens.whusdc,
  },
  {
    pid: 1,
    lpSymbol: 'lzUSDC-lzWETH LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH>',
    token: mainnetTokens.lzweth,
    quoteToken: mainnetTokens.lzusdc,
  },
].map((p) => ({
  ...p,
  token: p.token.equals(p.quoteToken) ? p.token.serialize : Pair.sortToken(p.token, p.quoteToken)[1].serialize,
  quoteToken: p.token.equals(p.quoteToken)
    ? p.quoteToken.serialize
    : Pair.sortToken(p.token, p.quoteToken)[0].serialize,
}))

export default farms
