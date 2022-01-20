/* eslint-disable no-param-reassign */
// import { isTradeBetter } from 'utils/trades'
import { Currency, CurrencyAmount, Pair, Token, Trade } from '@pancakeswap/sdk'
// import flatMap from 'lodash/flatMap'
import { useMemo } from 'react'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'

// import { useUserSingleHopOnly } from 'state/user/hooks'
// import { BETTER_TRADE_LESS_HOPS_THRESHOLD } from '../config/constants'
// import { wrappedCurrency } from '../utils/wrappedCurrency'

// import { useUnsupportedTokens } from './Tokens'

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Trade | null {
  return useMemo(() => {
    if (currencyAmountIn && currencyOut) {
      return (
        // Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 1, maxNumResults: 1 })[0] ??
        null
      )
    }

    return null
  }, [currencyAmountIn, currencyOut])
}
