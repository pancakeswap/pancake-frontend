import { ChainId, WBNB } from '@pancakeswap/sdk'

import { USDT } from './common'

export const opBnbTokens = {
  wbnb: WBNB[ChainId.OPBNB],
  usdt: USDT[ChainId.OPBNB],
}
