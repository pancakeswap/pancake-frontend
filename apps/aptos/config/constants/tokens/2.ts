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
    '0x9460030cb9e68bf33ced3e65d48e8c62610acd9f13c1a6197740733d8b72be60::pancake::Cake',
    8,
    'CAKE',
    'PancakeSwap Token',
    '',
  ),
  eth: new Coin(
    ChainId.TESTNET,
    '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH',
    8,
    'ETH',
    'ETH Token',
    '',
  ),
  bnb: new Coin(
    ChainId.TESTNET,
    '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBNB',
    8,
    'BNB',
    'BNB Token',
    '',
  ),
}
