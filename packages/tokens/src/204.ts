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
}
