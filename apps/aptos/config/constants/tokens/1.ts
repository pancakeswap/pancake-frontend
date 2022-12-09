import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { APT } from '../../coins'

export const mainnetTokens = {
  apt: APT[ChainId.MAINNET],
  l0usdc: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    6,
    'LayerZero - USDC',
    'USDC',
  ),
  l0usdt: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    6,
    'LayerZero - Tether USD',
    'USDT',
  ),
  l0weth: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
    6,
    'LayerZero - Wrapped Ether',
    'WETH',
  ),
  celerusdc: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin',
    6,
    'Celer - USD Coin',
    'USDC',
  ),
  celerusdt: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin',
    6,
    'Celer - Tether USD',
    'USDT',
  ),
  celerweth: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin',
    8,
    'Celer - Wrapped Ether',
    'WETH',
  ),
  celerbnb: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin',
    8,
    'Celer - Binance Coin',
    'BNB',
  ),
  stapt: new Coin(
    ChainId.MAINNET,
    '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos',
    8,
    'Ditto Staked Aptos',
    'stAPT',
  ),
}
