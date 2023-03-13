import { Pair, ChainId } from '@pancakeswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { testnetTokens } from '../tokens/index'
import { L0_USDC } from '../../coins'

const farms: SerializedFarmConfig[] = [
  /**
   * These 1 farms (PID 0) should always be at the top of the file.
   */
  {
    pid: 1,
    lpSymbol: testnetTokens.cake.symbol,
    lpAddress: testnetTokens.cake.address,
    token: testnetTokens.cake,
    quoteToken: testnetTokens.cake,
  },
  {
    pid: 5,
    lpSymbol: 'USDC-CAKE LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC, 0xe0e5ad285cbcdb873b2ee15bb6bcac73d9d763bcb58395e894255eeecf3992cf::pancake::Cake>',
    token: testnetTokens.cake,
    quoteToken: L0_USDC[ChainId.TESTNET],
  },
  {
    pid: 4,
    lpSymbol: 'APT-CAKE LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0xe0e5ad285cbcdb873b2ee15bb6bcac73d9d763bcb58395e894255eeecf3992cf::pancake::Cake>',
    token: testnetTokens.cake,
    quoteToken: testnetTokens.apt,
  },
  {
    pid: 3,
    lpSymbol: 'APT-USDC LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC>',
    token: L0_USDC[ChainId.TESTNET],
    quoteToken: testnetTokens.apt,
  },
  {
    pid: 2,
    lpSymbol: 'APT-MOON LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0x9477f691050b3b2816993262827617e665bcb182cf23272557c2335a5bc16d90::moon_coin::MoonCoin>',
    token: testnetTokens.moon,
    quoteToken: testnetTokens.apt,
  },
  {
    pid: 0,
    lpSymbol: 'MOON',
    lpAddress: '0x9477f691050b3b2816993262827617e665bcb182cf23272557c2335a5bc16d90::moon_coin::MoonCoin',
    token: testnetTokens.moon,
    quoteToken: testnetTokens.moon,
  },
].map((p) => ({
  ...p,
  token: p.token.equals(p.quoteToken) ? p.token.serialize : Pair.sortToken(p.token, p.quoteToken)[1].serialize,
  quoteToken: p.token.equals(p.quoteToken)
    ? p.quoteToken.serialize
    : Pair.sortToken(p.token, p.quoteToken)[0].serialize,
}))

export default farms
