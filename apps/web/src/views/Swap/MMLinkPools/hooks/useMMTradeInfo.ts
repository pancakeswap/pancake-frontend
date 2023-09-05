import { ChainId, Currency, CurrencyAmount, Percent, Price, TradeType, ZERO_PERCENT } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'

import { MM_SWAP_CONTRACT_ADDRESS } from '../constants'
import { computeTradePriceBreakdown } from '../utils/exchange'

interface Options {
  mmTrade?: SmartRouterTrade<TradeType> | null
  allowedSlippage: number
  chainId: ChainId
  mmSwapInputError: string
}

export interface MMTradeInfo {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  route: {
    path: Currency[]
  }
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  executionPrice: Price<Currency, Currency>
  routerAddress: string
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency> | null
  inputError: string
  trade: SmartRouterTrade<TradeType>
}

export function useMMTradeInfo({ mmTrade, chainId, mmSwapInputError }: Options): MMTradeInfo | null {
  return useMemo(() => {
    if (!mmTrade) {
      return null
    }
    return {
      trade: mmTrade,
      tradeType: mmTrade.tradeType,
      route: mmTrade.routes[0],
      inputAmount: mmTrade.inputAmount,
      outputAmount: mmTrade.outputAmount,
      slippageAdjustedAmounts: {
        [Field.INPUT]: mmTrade && mmTrade.inputAmount,
        [Field.OUTPUT]: mmTrade && mmTrade.outputAmount,
      },
      executionPrice: new Price(
        mmTrade.inputAmount.currency,
        mmTrade.outputAmount.currency,
        mmTrade.inputAmount.quotient,
        mmTrade.outputAmount.quotient,
      ),
      routerAddress: MM_SWAP_CONTRACT_ADDRESS[chainId],
      priceImpactWithoutFee: ZERO_PERCENT,
      realizedLPFee: computeTradePriceBreakdown(mmTrade).realizedLPFee,
      inputError: mmSwapInputError,
    }
  }, [mmTrade, chainId, mmSwapInputError])
}
