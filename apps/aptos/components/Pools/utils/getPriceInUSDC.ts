import _get from 'lodash/get'
import _toString from 'lodash/toString'
import _partition from 'lodash/partition'

import _toNumber from 'lodash/toNumber'

import { Trade } from '@pancakeswap/aptos-swap-sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'

export function getPriceInUSDC({ availablePairs, tokenIn, usdcCoin }) {
  const tokenInAmount = tryParseAmount('1', tokenIn)

  if (!tokenInAmount || !availablePairs?.length) {
    return 0
  }

  const trade = Trade.bestTradeExactIn(availablePairs, tokenInAmount, usdcCoin, { maxHops: 3, maxNumResults: 1 })[0]

  const usdcAmount = trade?.outputAmount?.toSignificant() || '0'

  return _toNumber(usdcAmount)
}
