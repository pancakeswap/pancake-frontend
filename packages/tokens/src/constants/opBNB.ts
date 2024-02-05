import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WBNB } from '@pancakeswap/sdk'

import { CAKE, USDT } from './common'

export const opBnbTokens = {
  wbnb: WBNB[ChainId.OPBNB],
  usdt: USDT[ChainId.OPBNB],
  cake: CAKE[ChainId.OPBNB],
  alp: new ERC20Token(
    ChainId.OPBNB,
    '0xC8424F526553ac394E9020DB0a878fAbe82b698C',
    18,
    'ALP',
    'ApolloX LP',
    'https://www.apollox.finance/en',
  ),
  eth: new ERC20Token(
    ChainId.OPBNB,
    '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    18,
    'ETH',
    'Ethereum',
    'https://opbnb.bnbchain.org/en',
  ),
  fdusd: new ERC20Token(
    ChainId.OPBNB,
    '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    18,
    'FDUSD',
    'First Digital USD',
    'https://firstdigitallabs.com/',
  ),
}
