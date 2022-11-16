import { Currency, CurrencyAmount, TradeType, Trade, Price, ChainId } from '@pancakeswap/sdk'
import { TradeWithStableSwap, RouteType, Trade as SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'

import { Field } from 'state/swap/actions'
import { computeSlippageAdjustedAmounts as computeSlippageAdjustedAmountsForV2Trade } from 'utils/exchange'
import { ROUTER_ADDRESS } from 'config/constants/exchange'

import { computeSlippageAdjustedAmounts } from '../utils/exchange'

interface Options {
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null
  v2Trade?: Trade<Currency, Currency, TradeType> | null
  useSmartRouter?: boolean
  allowedSlippage: number
  chainId: ChainId
}

interface Info {
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  amountToApprove: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  routerAddress: string
}

export function useTradeInfo({
  trade,
  v2Trade,
  useSmartRouter = true,
  allowedSlippage = 0,
  chainId,
}: Options): Info | null {
  return useMemo(() => {
    const fallbackV2 = !useSmartRouter || trade?.route.routeType === RouteType.V2
    if (!trade || (fallbackV2 && !v2Trade)) {
      return null
    }

    if (fallbackV2) {
      return {
        inputAmount: v2Trade.inputAmount,
        outputAmount: v2Trade.outputAmount,
        amountToApprove: computeSlippageAdjustedAmountsForV2Trade(v2Trade, allowedSlippage)[Field.INPUT],
        executionPrice: v2Trade.executionPrice,
        routerAddress: ROUTER_ADDRESS[chainId],
      }
    }
    return {
      inputAmount: trade.inputAmount,
      outputAmount: trade.outputAmount,
      amountToApprove: computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT],
      executionPrice: SmartRouterTrade.executionPrice(trade),
      // TODO should use the new router address
      routerAddress: ROUTER_ADDRESS[chainId],
    }
  }, [useSmartRouter, trade, v2Trade, allowedSlippage, chainId])
}
