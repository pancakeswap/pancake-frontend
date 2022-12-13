import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { APT, CAKE } from '../../coins'

export const mainnetTokens = {
  apt: APT[ChainId.MAINNET],
  cake: CAKE[ChainId.MAINNET],
  lzusdc: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    6,
    'LayerZero - USDC',
    'lzUSDC',
  ),
  lzusdt: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
    6,
    'LayerZero - Tether USD',
    'lzUSDT',
  ),
  lzweth: new Coin(
    ChainId.MAINNET,
    '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH',
    6,
    'LayerZero - Wrapped Ether',
    'lzWETH',
  ),
  ceusdc: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdcCoin',
    6,
    'Celer - USD Coin',
    'ceUSDC',
  ),
  ceusdt: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::UsdtCoin',
    6,
    'Celer - Tether USD',
    'ceUSDT',
  ),
  ceweth: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WethCoin',
    8,
    'Celer - Wrapped Ether',
    'ceWETH',
  ),
  cebnb: new Coin(
    ChainId.MAINNET,
    '0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::BnbCoin',
    8,
    'Celer - Binance Coin',
    'ceBNB',
  ),
  stapt: new Coin(
    ChainId.MAINNET,
    '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos',
    8,
    'Ditto Staked Aptos',
    'stAPT',
  ),
}
