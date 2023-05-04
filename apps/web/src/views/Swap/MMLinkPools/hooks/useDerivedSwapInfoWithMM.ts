import { useDebounce } from '@pancakeswap/hooks'
import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { LegacyTradeWithStableSwap } from '@pancakeswap/smart-router/legacy-router'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { useExpertMode, useUserSlippage } from '@pancakeswap/utils/user'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMMDevMode } from '../components/MMAndAMMDealDisplay'
import { MMOrderBookTrade, MMRfqTrade } from '../types'
import { useGetRFQId, useGetRFQTrade } from './useGetRFQTrade'
import { useIsTradeWithMMBetter } from './useIsMMTradeBetter'
import { useMMTrade } from './useMMOrderBookTrade'
import { useMMQuoteCountDown } from './useMMQuoteCountDown'
import { MMTradeInfo, useMMTradeInfo } from './useMMTradeInfo'

export function useDerivedBestTradeWithMM<T extends TradeType>(bestTrade?: SmartRouterTrade<T>) {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  return useDerivedSwapInfoWithMM(independentField, typedValue, inputCurrency, outputCurrency, null, bestTrade)
}

export function useDerivedSwapInfoWithMM(
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  v2Trade?: Trade<Currency, Currency, TradeType>,
  tradeWithStableSwap?: LegacyTradeWithStableSwap<Currency, Currency, TradeType> | SmartRouterTrade<TradeType>,
): {
  mmTradeInfo: MMTradeInfo
  isMMBetter: boolean
  mmQuoteExpiryRemainingSec: number
  mmOrderBookTrade: MMOrderBookTrade
  mmRFQTrade: MMRfqTrade
} {
  const [isExpertMode] = useExpertMode()
  const isMMDev = useMMDevMode()
  const [allowedSlippage] = useUserSlippage()
  const { account, chainId } = useAccountActiveChain()
  const deBounceTypedValue = useDebounce(typedValue, 300)
  const mmOrderBookTrade = useMMTrade(independentField, deBounceTypedValue, inputCurrency, outputCurrency)

  const isMMOrderBookTradeBetter = useIsTradeWithMMBetter({
    independentField,
    trade: tradeWithStableSwap,
    v2Trade,
    tradeWithMM: mmOrderBookTrade?.trade,
    isExpertMode,
  })

  const { refreshRFQ, rfqId } = useGetRFQId(
    (!mmOrderBookTrade?.inputError || isMMDev) && mmOrderBookTrade?.mmParam,
    isMMOrderBookTradeBetter,
    mmOrderBookTrade?.rfqUserInputPath,
    mmOrderBookTrade?.isRFQLive,
  )

  const mmRFQTrade = useGetRFQTrade(
    rfqId,
    independentField,
    inputCurrency,
    outputCurrency,
    isMMOrderBookTradeBetter,
    refreshRFQ,
    mmOrderBookTrade?.isRFQLive,
  )

  const isMMBetter = useIsTradeWithMMBetter({
    independentField,
    trade: tradeWithStableSwap,
    v2Trade,
    tradeWithMM: mmRFQTrade?.trade,
    isExpertMode,
  })

  const mmTradeInfo = useMMTradeInfo({
    mmTrade: mmRFQTrade?.trade || mmOrderBookTrade?.trade,
    allowedSlippage,
    chainId,
    mmSwapInputError: mmOrderBookTrade?.inputError,
  })

  const mmQuoteExpiryRemainingSec = useMMQuoteCountDown(
    mmRFQTrade?.trade ? mmRFQTrade?.quoteExpiry : null,
    isMMBetter ? mmRFQTrade?.refreshRFQ : undefined,
  )

  return {
    mmTradeInfo,
    isMMBetter: account ? isMMBetter : isMMOrderBookTradeBetter,
    mmQuoteExpiryRemainingSec,
    mmOrderBookTrade,
    mmRFQTrade,
  }
}
