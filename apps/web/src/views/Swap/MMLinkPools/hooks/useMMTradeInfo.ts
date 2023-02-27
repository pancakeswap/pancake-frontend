import { ChainId, Currency, CurrencyAmount, Percent, Price, TradeType, ZERO_PERCENT } from '@pancakeswap/sdk'
import { Pair } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'

import { MM_SWAP_CONTRACT_ADDRESS } from '../constants'
import { computeTradePriceBreakdown } from '../utils/exchange'

import { TradeWithMM } from '../types'

interface Options {
  mmTrade?: TradeWithMM<Currency, Currency, TradeType> | null
  useMMToTrade: boolean
  allowedSlippage: number
  chainId: ChainId
  mmSwapInputError: string
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
  inputError: string
  trade: TradeWithMM<Currency, Currency, TradeType>
}

export function useMMTradeInfo({ mmTrade, useMMToTrade = false, chainId, mmSwapInputError }: Options): Info | null {
  return useMemo(() => {
    if (!mmTrade || !useMMToTrade) {
      return null
    }
    return {
      trade: mmTrade,
      tradeType: mmTrade.tradeType,
      route: mmTrade.route,
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
  }, [mmTrade, chainId, mmSwapInputError, useMMToTrade])
}
