/* eslint-disable no-param-reassign */
// import { isTradeBetter } from 'utils/trades'
import { Currency, CurrencyAmount, Mint } from 'peronio-sdk'
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
export function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Mint | null {
  return useMemo(() => {
    if (currencyAmountIn && currencyOut) {
      return Mint.exactIn(currencyAmountIn)
    }

    return null
  }, [currencyAmountIn, currencyOut])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Mint | null {
  return useMemo(() => {
    if (currencyIn && currencyAmountOut) {
      return Mint.exactOut(currencyAmountOut)
    }

    return null
  }, [currencyAmountOut, currencyIn])
}
