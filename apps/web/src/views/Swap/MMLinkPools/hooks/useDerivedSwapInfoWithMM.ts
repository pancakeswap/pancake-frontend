import { useDebounce } from '@pancakeswap/hooks'
import { Currency } from '@pancakeswap/sdk'
import { useUserSlippage, useExpertMode } from '@pancakeswap/utils/user'
import { Field } from 'state/swap/actions'
import { useMMTrade } from './useMMOrderBookTrade'
import { useIsTradeWithMMBetter } from './useIsMMTradeBetter'
import { useGetRFQId, useGetRFQTrade } from './useGetRFQTrade'
import { useMMDevMode } from '../components/MMAndAMMDealDisplay'
import { MMTradeInfo, useMMTradeInfo } from './useMMTradeInfo'
import { useMMQuoteCountDown } from './useMMQuoteCountDown'
import useActiveWeb3React from '../../../../hooks/useActiveWeb3React'
import { MMOrderBookTrade, MMRfqTrade } from '../types'

export function useDerivedSwapInfoWithMM(
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  v2Trade,
  tradeWithStableSwap,
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
  const { account, chainId } = useActiveWeb3React()
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
    (!mmOrderBookTrade.inputError || isMMDev) && mmOrderBookTrade?.mmParam,
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

  const { remainingSec: mmQuoteExpiryRemainingSec } = useMMQuoteCountDown(
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
