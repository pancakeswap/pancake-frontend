import { useMemo } from 'react'
import { ChainId, Currency, CurrencyAmount, Percent, Price, Trade, TradeType } from '@pancakeswap/sdk'
import { Pair, RouteType, Trade as SmartRouterTrade, TradeWithStableSwap } from '@pancakeswap/smart-router/evm'

import { Field } from 'state/swap/actions'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import {
  computeSlippageAdjustedAmounts as computeSlippageAdjustedAmountsForV2Trade,
  computeTradePriceBreakdown as computeTradePriceBreakdownForV2Trade,
} from 'utils/exchange'

import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, SMART_ROUTER_ADDRESS } from '../utils/exchange'

interface Options {
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null
  v2Trade?: Trade<Currency, Currency, TradeType> | null
  useSmartRouter?: boolean
  allowedSlippage: number
  chainId: ChainId
  swapInputError: string
  stableSwapInputError: string
}

interface Info {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  route: {
    pairs: Pair[]
    path: Currency[]
  }
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  executionPrice: Price<Currency, Currency>
  routerAddress: string
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency> | null
  fallbackV2: boolean
  inputError: string
}

export function useTradeInfo({
  trade,
  v2Trade,
  useSmartRouter = true,
  allowedSlippage = 0,
  chainId,
  swapInputError,
  stableSwapInputError,
}: Options): Info | null {
  return useMemo(() => {
    if (!trade && !v2Trade) {
      return null
    }
    const smartRouterAvailable = useSmartRouter && !!trade
    const fallbackV2 = !smartRouterAvailable || trade?.route.routeType === RouteType.V2

    if (fallbackV2) {
      if (v2Trade) {
        const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdownForV2Trade(v2Trade)
        return {
          tradeType: v2Trade.tradeType,
          fallbackV2,
          route: v2Trade.route,
          inputAmount: v2Trade.inputAmount,
          outputAmount: v2Trade.outputAmount,
          slippageAdjustedAmounts: computeSlippageAdjustedAmountsForV2Trade(v2Trade, allowedSlippage),
          executionPrice: v2Trade.executionPrice,
          routerAddress: ROUTER_ADDRESS[chainId],
          priceImpactWithoutFee,
          realizedLPFee,
          inputError: swapInputError,
        }
      }
      return null
    }

    const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
    return {
      tradeType: trade.tradeType,
      fallbackV2,
      route: trade.route,
      inputAmount: trade.inputAmount,
      outputAmount: trade.outputAmount,
      slippageAdjustedAmounts: computeSlippageAdjustedAmounts(trade, allowedSlippage),
      executionPrice: SmartRouterTrade.executionPrice(trade),
      routerAddress: SMART_ROUTER_ADDRESS[chainId],
      priceImpactWithoutFee,
      realizedLPFee,
      inputError: stableSwapInputError,
    }
  }, [useSmartRouter, trade, v2Trade, allowedSlippage, chainId, stableSwapInputError, swapInputError])
}
