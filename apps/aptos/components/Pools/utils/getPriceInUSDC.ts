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

  const trades = Trade.bestTradeExactIn(availablePairs, tokenInAmount, usdcCoin, { maxHops: 3, maxNumResults: 3 })

  const bestTrade = trades?.length
    ? trades.reduce((bTrade, currenctTrade) => {
        if (bTrade && Trade.isTradeBetter(bTrade, currenctTrade)) return bTrade

        return currenctTrade
      })
    : null

  const usdcAmount = bestTrade?.outputAmount?.toSignificant() || '0'

  return _toNumber(usdcAmount)
}
