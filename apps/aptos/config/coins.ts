import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN } from 'aptos'

export const APT_INFO = {
  symbol: 'APT',
  decimal: 8,
  name: 'Aptos coin',
}

export const APT = {
  [ChainId.AIT3]: new Coin(ChainId.AIT3, APTOS_COIN, APT_INFO.decimal, APT_INFO.symbol, APT_INFO.name),
  [ChainId.DEVNET]: new Coin(ChainId.DEVNET, APTOS_COIN, APT_INFO.decimal, APT_INFO.symbol, APT_INFO.name),
  [ChainId.TESTNET]: new Coin(ChainId.TESTNET, APTOS_COIN, APT_INFO.decimal, APT_INFO.symbol, APT_INFO.name),
}
