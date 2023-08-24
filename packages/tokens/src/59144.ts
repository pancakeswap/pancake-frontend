import { ChainId, ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { USDC, USDT } from './common'

export const lineaTokens = {
  weth: WETH9[ChainId.LINEA],
  usdc: USDC[ChainId.LINEA],
  wbtc: new ERC20Token(ChainId.LINEA, '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4', 8, 'WBTC', 'Wrapped BTC'),
  usdt: USDT[ChainId.LINEA],
}
