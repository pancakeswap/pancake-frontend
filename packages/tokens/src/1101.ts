import { WETH9, ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, USDT, CAKE } from './common'

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
  wbtc: new ERC20Token(ChainId.POLYGON_ZKEVM, '0xEA034fb02eB1808C2cc3adbC15f447B93CbE08e1', 8, 'WBTC', 'Wrapped BTC'),
}
