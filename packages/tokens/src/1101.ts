import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'
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
}
