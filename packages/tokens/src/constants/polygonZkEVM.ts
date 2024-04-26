import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { CAKE, USDC, USDT } from './common'

export const polygonZkEvmTokens = {
  weth: WETH9[ChainId.POLYGON_ZKEVM],
  usdc: USDC[ChainId.POLYGON_ZKEVM],
  usdt: USDT[ChainId.POLYGON_ZKEVM],
  cake: CAKE[ChainId.POLYGON_ZKEVM],
  matic: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0xa2036f0538221a77A3937F1379699f44945018d0',
    18,
    'MATIC',
    'Matic Token',
    'https://polygon.technology/polygon-zkevm',
  ),
  grai: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0xCA68ad4EE5c96871EC6C6dac2F714a8437A3Fe66',
    18,
    'GRAI',
    'Gravita Debt Token',
    'https://www.gravitaprotocol.com/',
  ),
  wbtc: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0xEA034fb02eB1808C2cc3adbC15f447B93CbE08e1',
    8,
    'WBTC',
    'Wrapped BTC',
    'https://bitcoin.org/',
  ),
  usdce: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0x37eAA0eF3549a5Bb7D431be78a3D99BD360d19e5',
    6,
    'USDC.E',
    'USD Coin',
    'https://www.centre.io/',
  ),
  reth: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0xb23C20EFcE6e24Acca0Cef9B7B7aA196b84EC942',
    18,
    'rETH',
    'Rocket Pool ETH',
    'https://www.rocketpool.net/',
  ),
  rsETH: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0x8C7D118B5c47a5BCBD47cc51789558B98dAD17c5',
    18,
    'rsETH',
    'rsETH',
    'https://kelpdao.xyz/',
  ),
  wstETH: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0x5D8cfF95D7A57c0BF50B30b43c7CC0D52825D4a9',
    18,
    'wstETH',
    'Wrapped liquid staked Ether 2.0',
    'https://lido.fi/',
  ),
}
