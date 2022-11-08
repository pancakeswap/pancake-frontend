import type { SerializedFarmConfig } from '@pancakeswap/farms'
import { testnetTokens } from 'config/constants/tokens'
import { CAKE_PID } from '..'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'MOON',
    lpAddress: '0x9477f691050b3b2816993262827617e665bcb182cf23272557c2335a5bc16d90::moon_coin::MoonCoin',
    token: testnetTokens.moon,
    quoteToken: testnetTokens.moon,
  },
  {
    pid: 1,
    lpSymbol: 'APT-MOON LP',
    lpAddress:
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::LPToken<0x1::aptos_coin::AptosCoin, 0x9477f691050b3b2816993262827617e665bcb182cf23272557c2335a5bc16d90::moon_coin::MoonCoin>',
    token: testnetTokens.moon,
    quoteToken: testnetTokens.apt,
  },
  {
    pid: CAKE_PID,
    lpSymbol: testnetTokens.cake.symbol,
    lpAddress: testnetTokens.cake.address,
    token: testnetTokens.cake,
    quoteToken: testnetTokens.cake,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
