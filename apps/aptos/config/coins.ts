import { AptosCoin, ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'

export const APT = {
  [ChainId.TESTNET]: AptosCoin.onChain(ChainId.TESTNET),
  [ChainId.MAINNET]: AptosCoin.onChain(ChainId.MAINNET),
}

export const USDC = {
  [ChainId.MAINNET]: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    6,
    'USDC',
    'USD coin',
  ),
  [ChainId.TESTNET]: new Coin(
    ChainId.TESTNET,
    '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC',
    8,
    'USDC',
    'USD coin',
  ),
}
