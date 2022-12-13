import { AptosCoin, ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'

export const APT = {
  [ChainId.TESTNET]: AptosCoin.onChain(ChainId.TESTNET),
  [ChainId.MAINNET]: AptosCoin.onChain(ChainId.MAINNET),
}

export const L0_USDC = {
  [ChainId.MAINNET]: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    6,
    'lzUSDC',
    'USD coin',
  ),
  [ChainId.TESTNET]: new Coin(
    ChainId.TESTNET,
    '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC',
    8,
    'lzUSDC',
    'USD coin',
  ),
}

export const CE_USDC_MAINNET = new Coin(
  ChainId.MAINNET,
  '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin',
  6,
  'ceUSDC',
  'Celer - USD Coin',
)

export const CAKE = {
  [ChainId.MAINNET]: new Coin(
    ChainId.MAINNET,
    '0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT',
    8,
    'CAKE',
    'PancakeSwap Token',
  ),
  [ChainId.TESTNET]: new Coin(
    ChainId.TESTNET,
    '0xe0e5ad285cbcdb873b2ee15bb6bcac73d9d763bcb58395e894255eeecf3992cf::pancake::Cake',
    8,
    'CAKE',
    'PancakeSwap Token',
  ),
}
