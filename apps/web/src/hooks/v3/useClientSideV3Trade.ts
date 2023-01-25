import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { Route, SwapQuoter } from '@pancakeswap/v3-sdk'
import { useQuoterContract } from 'hooks/useContract'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { useSingleContractWithCallData } from 'state/multicall/hooks'
import { InterfaceTrade, TradeState } from 'state/swap/types'

import { useAllV3Routes } from './useAllV3Routes'

const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useClientSideV3Trade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
): { state: TradeState; trade: InterfaceTrade<Currency, Currency, TTradeType> | undefined } {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [amountSpecified?.currency, otherCurrency]
      : [otherCurrency, amountSpecified?.currency]
  const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, currencyOut)

  // Chains deployed using the deploy-v3 script only deploy QuoterV2.
  const useQuoterV2 = false
  const quoter = useQuoterContract(useQuoterV2)
  const callData = useMemo(
    () =>
      amountSpecified
        ? routes.map(
            (route) => SwapQuoter.quoteCallParameters(route, amountSpecified, tradeType, { useQuoterV2 }).calldata,
          )
        : [],
    [amountSpecified, routes, tradeType, useQuoterV2],
  )

  const quotesResults = useSingleContractWithCallData(quoter, callData, {
    gasRequired: DEFAULT_GAS_QUOTE,
  })

  return useMemo(() => {
    if (
      !amountSpecified ||
      !currencyIn ||
      !currencyOut ||
      quotesResults.some(({ valid }) => !valid) ||
      // skip when tokens are the same
      (tradeType === TradeType.EXACT_INPUT
        ? amountSpecified.currency.equals(currencyOut)
        : amountSpecified.currency.equals(currencyIn))
    ) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
      }
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      return {
        state: TradeState.LOADING,
        trade: undefined,
      }
    }

    const { bestRoute, amountIn, amountOut } = quotesResults.reduce(
      (
        currentBest: {
          bestRoute: Route<Currency, Currency> | null
          amountIn: CurrencyAmount<Currency> | null
          amountOut: CurrencyAmount<Currency> | null
        },
        { result },
        i,
      ) => {
        if (!result) return currentBest

        // overwrite the current best if it's not defined or if this route is better
        if (tradeType === TradeType.EXACT_INPUT) {
          const aOut = CurrencyAmount.fromRawAmount(currencyOut, result.amountOut.toString())
          if (currentBest.amountOut === null || JSBI.lessThan(currentBest.amountOut.quotient, amountOut.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn: amountSpecified,
              amountOut: aOut,
            }
          }
        } else {
          const aIn = CurrencyAmount.fromRawAmount(currencyIn, result.amountIn.toString())
          if (currentBest.amountIn === null || JSBI.greaterThan(currentBest.amountIn.quotient, amountIn.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn: aIn,
              amountOut: amountSpecified,
            }
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountIn: null,
        amountOut: null,
      },
    )

    if (!bestRoute || !amountIn || !amountOut) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      }
    }

    return {
      state: TradeState.VALID,
      trade: new InterfaceTrade({
        v2Routes: [],
        v3Routes: [
          {
            routev3: bestRoute,
            inputAmount: amountIn,
            outputAmount: amountOut,
          },
        ],
        tradeType,
      }),
    }
  }, [amountSpecified, currencyIn, currencyOut, quotesResults, routes, routesLoading, tradeType])
}
