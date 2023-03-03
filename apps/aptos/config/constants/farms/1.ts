import { Pair } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { mainnetTokens } from '../tokens/index'

const farms: SerializedFarmConfig[] = [
  /**
   * These farms should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'CAKE',
    lpAddress: '0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT',
    token: mainnetTokens.cake,
    quoteToken: mainnetTokens.cake,
  },
  {
    pid: 1,
    lpSymbol: 'CAKE-APT LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT, 0x1::aptos_coin::AptosCoin>',
    token: mainnetTokens.apt,
    quoteToken: mainnetTokens.cake,
  },
  {
    pid: 2,
    lpSymbol: 'CAKE-lzUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    token: mainnetTokens.lzusdc,
    quoteToken: mainnetTokens.cake,
  },
  {
    pid: 3,
    lpSymbol: 'CAKE-ceUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT, 0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>',
    token: mainnetTokens.ceusdc,
    quoteToken: mainnetTokens.cake,
  },
  // * By order of release
  {
    pid: 18,
    lpSymbol: 'APT-BLT LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xfbab9fb68bd2103925317b6a540baa20087b1e7a7a4eb90badee04abb6b5a16f::blt::Blt>',
    token: mainnetTokens.blt,
    quoteToken: mainnetTokens.apt,
  },
  {
    pid: 17,
    lpSymbol: 'ETERN-ceUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x25a64579760a4c64be0d692327786a6375ec80740152851490cfd0b53604cf95::coin::ETERN, 0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>',
    token: mainnetTokens.ceusdc,
    quoteToken: mainnetTokens.etern,
  },
  {
    pid: 16,
    lpSymbol: 'whUSDC-tAPT LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin>',
    token: mainnetTokens.tapt,
    quoteToken: mainnetTokens.whusdc,
  },
  {
    pid: 15,
    lpSymbol: 'APT-MOVE LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0x27fafcc4e39daac97556af8a803dbb52bcb03f0821898dc845ac54225b9793eb::move_coin::MoveCoin>',
    token: mainnetTokens.move,
    quoteToken: mainnetTokens.apt,
  },
  {
    pid: 6,
    lpSymbol: 'APT-lzUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    token: mainnetTokens.lzusdc,
    quoteToken: mainnetTokens.apt,
  },
  {
    pid: 5,
    lpSymbol: 'lzUSDC-lzWETH LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH>',
    token: mainnetTokens.lzweth,
    quoteToken: mainnetTokens.lzusdc,
  },
  {
    pid: 4,
    lpSymbol: 'lzUSDC-lzUSDT LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT>',
    token: mainnetTokens.lzusdt,
    quoteToken: mainnetTokens.lzusdc,
  },
  {
    pid: 10,
    lpSymbol: 'APT-ceUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>',
    token: mainnetTokens.ceusdc,
    quoteToken: mainnetTokens.apt,
  },
  {
    pid: 9,
    lpSymbol: 'ceBNB-ceUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin, 0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin>',
    token: mainnetTokens.ceusdc,
    quoteToken: mainnetTokens.cebnb,
  },
  {
    pid: 8,
    lpSymbol: 'ceUSDC-ceWETH LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin, 0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin>',
    token: mainnetTokens.ceweth,
    quoteToken: mainnetTokens.ceusdc,
  },
  {
    pid: 7,
    lpSymbol: 'ceUSDC-ceUSDT LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin, 0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin>',
    token: mainnetTokens.ceusdt,
    quoteToken: mainnetTokens.ceusdc,
  },
  {
    pid: 13,
    lpSymbol: 'APT-whUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>',
    token: mainnetTokens.whusdc,
    quoteToken: mainnetTokens.apt,
  },
  {
    pid: 12,
    lpSymbol: 'whUSDC-whWETH LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T>',
    token: mainnetTokens.whweth,
    quoteToken: mainnetTokens.whusdc,
  },
  {
    pid: 11,
    lpSymbol: 'whUSDC-whBUSD LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xccc9620d38c4f3991fa68a03ad98ef3735f18d04717cb75d7a1300dd8a7eed75::coin::T>',
    token: mainnetTokens.whbusd,
    quoteToken: mainnetTokens.whusdc,
  },
  {
    pid: 14,
    lpSymbol: 'stAPT-lzUSDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
    token: mainnetTokens.lzusdc,
    quoteToken: mainnetTokens.stapt,
  },
].map((p) => ({
  ...p,
  token: p.token.equals(p.quoteToken) ? p.token.serialize : Pair.sortToken(p.token, p.quoteToken)[1].serialize,
  quoteToken: p.token.equals(p.quoteToken)
    ? p.quoteToken.serialize
    : Pair.sortToken(p.token, p.quoteToken)[0].serialize,
}))

export default farms
