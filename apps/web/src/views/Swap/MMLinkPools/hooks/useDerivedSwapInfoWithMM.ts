import { useDebounce } from '@pancakeswap/hooks'
import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { useExpertMode, useUserSlippage } from '@pancakeswap/utils/user'
import { UnsafeCurrency } from 'config/constants/types'
import { useCurrency } from 'hooks/Tokens'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useRouter } from 'next/router'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { MMOrderBookTrade, MMRfqTrade } from '../types'
import { useGetRFQId, useGetRFQTrade } from './useGetRFQTrade'
import { useIsTradeWithMMBetter } from './useIsMMTradeBetter'
import { useMMTrade } from './useMMOrderBookTrade'
import { useMMQuoteCountDown } from './useMMQuoteCountDown'
import { MMTradeInfo, TradeEssentials, useMMTradeInfo } from './useMMTradeInfo'

export function useMMDevMode() {
  const { query } = useRouter()
  return Boolean(query['dev-mode'])
}

export function useDerivedBestTradeWithMM<T extends TradeEssentials>(bestTrade?: T) {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId) ?? undefined
  const outputCurrency = useCurrency(outputCurrencyId) ?? undefined

  return useDerivedSwapInfoWithMM<T>(independentField, typedValue, inputCurrency, outputCurrency, undefined, bestTrade)
}

export function useDerivedSwapInfoWithMM<T extends TradeEssentials>(
  independentField: Field,
  typedValue: string,
  inputCurrency: UnsafeCurrency,
  outputCurrency: UnsafeCurrency,
  v2Trade?: Trade<Currency, Currency, TradeType>,
  tradeWithStableSwap?: T,
): {
  mmTradeInfo: MMTradeInfo<SmartRouterTrade<TradeType>> | null
  isMMBetter: boolean
  mmQuoteExpiryRemainingSec: number | null
  mmOrderBookTrade: MMOrderBookTrade<SmartRouterTrade<TradeType>>
  mmRFQTrade: MMRfqTrade<SmartRouterTrade<TradeType>> | null
} {
  const [isExpertMode] = useExpertMode()
  const isMMDev = useMMDevMode()
  const [allowedSlippage] = useUserSlippage()
  const { account, chainId } = useAccountActiveChain()
  const deBounceTypedValue = useDebounce(typedValue, 300)
  const mmOrderBookTrade = useMMTrade(independentField, deBounceTypedValue, inputCurrency, outputCurrency)

  const isMMOrderBookTradeBetter = useIsTradeWithMMBetter<T>({
    independentField,
    trade: tradeWithStableSwap,
    v2Trade,
    tradeWithMM: mmOrderBookTrade.trade,
    isExpertMode,
  })

  const { refreshRFQ, rfqId } = useGetRFQId(
    ((!mmOrderBookTrade.inputError || isMMDev) && mmOrderBookTrade.mmParam) || null,
    isMMOrderBookTradeBetter,
    mmOrderBookTrade.rfqUserInputPath,
    mmOrderBookTrade.isRFQLive,
  )

  const mmRFQTrade = useGetRFQTrade(
    rfqId,
    independentField,
    inputCurrency,
    outputCurrency,
    isMMOrderBookTradeBetter,
    refreshRFQ,
    mmOrderBookTrade.isRFQLive,
  )

  const isMMBetter = useIsTradeWithMMBetter({
    independentField,
    trade: tradeWithStableSwap,
    v2Trade,
    tradeWithMM: mmRFQTrade?.trade,
    isExpertMode,
  })

  const mmTradeInfo = useMMTradeInfo({
    mmTrade: mmRFQTrade?.trade || mmOrderBookTrade.trade,
    allowedSlippage,
    chainId,
    mmSwapInputError: mmOrderBookTrade.inputError || '',
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
