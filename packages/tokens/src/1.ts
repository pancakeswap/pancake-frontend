import { ChainId, Token, WETH9 } from '@pancakeswap/sdk'

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: new Token(ChainId.ETHEREUM, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD', ''),
  usdc: new Token(ChainId.ETHEREUM, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USDCoin', ''),
  wbtc: new Token(ChainId.ETHEREUM, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC', ''),
}
