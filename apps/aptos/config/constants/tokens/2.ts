import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { APT } from 'config/coins'

export const testnetTokens = {
  apt: APT[ChainId.TESTNET],
  moon: new Coin(
    ChainId.TESTNET,
    '0x9477f691050b3b2816993262827617e665bcb182cf23272557c2335a5bc16d90::moon_coin::MoonCoin',
    6,
    'MOON',
    'Moon Coin',
    '',
  ),
  cake: new Coin(
    ChainId.TESTNET,
    '0x4517f79a25706e166d4d04362dfcdf4c366f8ed6093992cf2c9b8f6bf3af79f7::pancake::Cake',
    8,
    'CAKE',
    'PancakeSwap Token',
    '',
  ),
}
