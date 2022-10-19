import { ChainId, Token } from '@pancakeswap/sdk'
import { BUSD_ETHW } from './common'

export const ethwTokens = {
  bnb: new Token(
    ChainId.ETHW_MAINNET,
    '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    18,
    'BNB',
    'BNB',
    'https://www.binance.com/',
  ),
  usdt: new Token(
    ChainId.ETHW_MAINNET,
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    18,
    'USDT',
    'USDT',
    'https://www.binance.com/en/trade/BNB_USDT',
  ), 
  ethw: new Token(
    ChainId.ETHW_MAINNET,
    '0xaa7427d8f17d87a28f5e1ba3adbb270badbe1011',
    18,
    'ETHW',
    'ETHW',
    '',
  ), 
  runtogether: new Token(
    ChainId.ETHW_MAINNET,
    '0x81CF308d96DF5Def93435192CD768F6F0d3e6038',
    18,
    'RUN',
    'Run together',
    'https://runtogether.net/',
  ), 
}
