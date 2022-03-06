import JSBI from 'jsbi'
import { useDispatch, useSelector } from 'react-redux'
import { ParsedUrlQuery } from 'querystring'
import { Currency, CurrencyAmount, TokenAmount, Trade, Token, Price, ETHER } from '@pancakeswap/sdk'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import getPriceForOneToken from 'views/LimitOrders/utils/getPriceForOneToken'
import { isAddress } from 'utils'
import tryParseAmount from 'utils/tryParseAmount'
import { useCurrencyBalances } from '../wallet/hooks'
import { DEFAULT_INPUT_CURRENCY, DEFAULT_OUTPUT_CURRENCY } from './constants'
import { replaceLimitOrdersState, selectCurrency, setRateType, switchCurrencies, typeInput } from './actions'
import { Field, Rate, OrderState } from './types'
import { AppState, AppDispatch } from '..'

const applyExchangeRateTo = (
  inputValue: string,
  exchangeRate: string,
  inputCurrency: Currency,
  outputCurrency: Currency,
  isInverted: boolean,
): CurrencyAmount | undefined => {
  if (!inputValue || !inputCurrency || !outputCurrency) {
    return undefined
  }
  const parsedInputAmount = tryParseAmount(inputValue, isInverted ? outputCurrency : inputCurrency)
  const parsedExchangeRate = tryParseAmount(exchangeRate, isInverted ? inputCurrency : outputCurrency)

  if (!parsedExchangeRate || !parsedInputAmount) {
    return undefined
  }

  if (isInverted) {
    const invertedResultAsFraction = parsedInputAmount.asFraction
      .multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputCurrency.decimals)))
      .divide(parsedExchangeRate.asFraction)
    const invertedResultAsAmount =
      outputCurrency instanceof Token
        ? new TokenAmount(outputCurrency, invertedResultAsFraction.toFixed(0))
        : CurrencyAmount.ether(invertedResultAsFraction.toFixed(0))

    return invertedResultAsAmount
  }

  const resultAsFraction = parsedInputAmount.asFraction
    .multiply(parsedExchangeRate.asFraction)
    .multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputCurrency.decimals)))
  const resultAsAmount =
    outputCurrency instanceof Token
      ? new TokenAmount(outputCurrency, resultAsFraction.quotient.toString())
      : CurrencyAmount.ether(resultAsFraction.quotient.toString())
  return resultAsAmount
}

// Just returns Redux state for limitOrders
export const useOrderState = (): AppState['limitOrders'] => {
  return useSelector<AppState, AppState['limitOrders']>((state) => state.limitOrders)
}

// Returns handlers to change user-defined parts of limitOrders state
export const useOrderActionHandlers = (): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRateType: (rateType: Rate) => void
} => {
  const dispatch = useDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'BNB' : '',
        }),
      )
    },
    [dispatch],
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch],
  )

  const onChangeRateType = useCallback(
    (rateType: Rate) => {
      dispatch(setRateType({ rateType }))
    },
    [dispatch],
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRateType,
  }
}

export interface DerivedOrderInfo {
  currencies: { input: Currency | Token | undefined; output: Currency | Token | undefined }
  currencyBalances: {
    input: CurrencyAmount | undefined
    output: CurrencyAmount | undefined
  }
  inputError?: string
  trade: Trade | undefined
  parsedAmounts: {
    input: CurrencyAmount | undefined
    output: CurrencyAmount | undefined
  }
  formattedAmounts: {
    input: string
    output: string
    price: string
  }
  rawAmounts: {
    input: string | undefined
    output: string | undefined
  }
  price: Price | undefined
  wrappedCurrencies: {
    input: Token
    output: Token
  }
  singleTokenPrice: {
    [key: string]: number
  }
  currencyIds: {
    input: string
    output: string
  }
}

const getErrorMessage = (
  account: string,
  wrappedCurrencies: {
    input: Token
    output: Token
  },
  currencies: { input: Currency | Token; output: Currency | Token },
  currencyBalances: { input: CurrencyAmount; output: CurrencyAmount },
  parsedAmounts: { input: CurrencyAmount; output: CurrencyAmount },
  trade: Trade,
  price: Price,
  rateType: Rate,
) => {
  if (!account) {
    return 'Connect Wallet'
  }
  if (
    wrappedCurrencies.input &&
    wrappedCurrencies.output &&
    wrappedCurrencies.input.address.toLowerCase() === wrappedCurrencies.output.address.toLowerCase()
  ) {
    return 'Order not allowed'
  }
  const hasBothTokensSelected = currencies.input && currencies.output
  if (!hasBothTokensSelected) {
    return 'Select a token'
  }
  const hasAtLeastOneParsedAmount = parsedAmounts.input || parsedAmounts.output

  const tradeIsNotAvailable = !trade || !trade?.route
  if (hasAtLeastOneParsedAmount && tradeIsNotAvailable) {
    return 'Insufficient liquidity for this trade'
  }
  const someParsedAmountIsMissing = !parsedAmounts.input || !parsedAmounts.output
  if (someParsedAmountIsMissing) {
    return 'Enter an amount'
  }
  if (currencyBalances.input && currencyBalances.input.lessThan(parsedAmounts.input)) {
    return `Insufficient ${currencyBalances.input.currency.symbol} balance`
  }

  if (price) {
    if (
      rateType === Rate.MUL &&
      (price.lessThan(trade.executionPrice.asFraction) || price.equalTo(trade.executionPrice.asFraction))
    ) {
      return 'Only possible to place sell orders above market rate'
    }
    if (
      rateType === Rate.DIV &&
      (price.invert().greaterThan(trade.executionPrice.invert().asFraction) ||
        price.invert().equalTo(trade.executionPrice.invert().asFraction))
    ) {
      return 'Only possible to place buy orders below market rate'
    }
  }

  return undefined
}

// from the current swap inputs, compute the best trade and return it.
export const useDerivedOrderInfo = (): DerivedOrderInfo => {
  const { account, chainId } = useActiveWeb3React()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    rateType,
    inputValue,
  } = useOrderState()

  // Get Currency objects based on currencyId strings
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const currencies = useMemo(
    () => ({
      input: inputCurrency ?? undefined,
      output: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )

  const wrappedCurrencies = useMemo(
    () => ({
      input: wrappedCurrency(currencies.input, chainId),
      output: wrappedCurrency(currencies.output, chainId),
    }),
    [currencies.input, currencies.output, chainId],
  )

  // Get user balance for selected Currencies
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const currencyBalances = {
    input: relevantTokenBalances[0],
    output: relevantTokenBalances[1],
  }

  // Whether user modified the INPUT field most recently (also default initial state)
  const isExactIn = independentField === Field.INPUT
  // Whether user modified the PRICE field most recently
  const isDesiredRateUpdate = independentField === Field.PRICE

  // Get the amount of outputCurrency you'd receive at the desired price
  const desiredRateAppliedAsCurrencyAmount = isDesiredRateUpdate
    ? applyExchangeRateTo(inputValue, typedValue, inputCurrency, outputCurrency, rateType === Rate.DIV)
    : undefined

  // Convert output to string representation to parse later
  const desiredRateApplied =
    isDesiredRateUpdate && desiredRateAppliedAsCurrencyAmount
      ? desiredRateAppliedAsCurrencyAmount?.toSignificant(6)
      : typedValue

  // If independentField === Field.PRICE -> this won't be used
  const parsedTypedAmount = !isDesiredRateUpdate
    ? tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)
    : undefined

  // If not price - either input or output typing
  // if price - whatever amount of tokens recevied on the desired price
  const parsedAmountToUse = isDesiredRateUpdate
    ? tryParseAmount(desiredRateApplied, outputCurrency ?? undefined)
    : tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  // Get trade object
  // gonna be null if not isExactIn or if there is no outputCurrency selected
  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmountToUse : undefined, outputCurrency ?? undefined)
  // Works similarly to swap when you modify outputCurrency
  // But also is used when desired rate is modified
  // in other words it looks for a trade of inputCurrency for whatever the amount of tokens would be at desired rate
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmountToUse : undefined)
  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  // Get swap price for single token disregarding slippage and price impact
  // needed for chart's latest value
  const oneInputToken = tryParseAmount('1', currencies.input)
  const singleTokenTrade = useTradeExactIn(oneInputToken, currencies.output)
  const singleTokenPrice = parseFloat(singleTokenTrade?.executionPrice?.toSignificant(6))
  const inverseSingleTokenPrice = 1 / singleTokenPrice

  // Get CurrencyAmount for the inputCurrency amount specified by user
  const inputAmount = useMemo(() => {
    return tryParseAmount(inputValue, inputCurrency ?? undefined)
  }, [inputValue, inputCurrency])

  // Get "final" amounts
  const parsedAmounts = useMemo(
    () => ({
      input: independentField === Field.INPUT ? parsedTypedAmount : inputAmount ?? trade?.inputAmount,
      output: independentField === Field.OUTPUT ? parsedTypedAmount : trade?.outputAmount,
    }),
    [independentField, parsedTypedAmount, inputAmount, trade],
  )

  // If user is editing the price and there is no trade for this swap - show amount from desiredRateAppliedAsCurrencyAmount
  if (!parsedAmounts.output && desiredRateAppliedAsCurrencyAmount) {
    parsedAmounts.output = desiredRateAppliedAsCurrencyAmount
  }

  // Calculate the price for specified swap
  const price = useMemo(
    () => getPriceForOneToken(parsedAmounts.input, parsedAmounts.output),
    [parsedAmounts.input, parsedAmounts.output],
  )

  // Formatted amounts to use in the UI
  const formattedAmounts = {
    input: inputValue && inputValue !== '' ? inputValue : parsedAmounts.input?.toSignificant(6) ?? '',
    output: independentField === Field.OUTPUT ? typedValue : parsedAmounts.output?.toSignificant(6) ?? '',
    price:
      independentField === Field.PRICE
        ? typedValue
        : rateType === Rate.MUL
        ? price?.toSignificant(6) ?? ''
        : price?.invert().toSignificant(6) ?? '',
  }

  // Get raw amounts that will be used in smart contract call
  const rawAmounts = useMemo(
    () => ({
      input: inputCurrency
        ? parsedAmounts.input
            ?.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputCurrency.decimals)))
            .toFixed(0)
        : undefined,

      output: outputCurrency
        ? parsedAmounts.output
            ?.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputCurrency.decimals)))
            .toFixed(0)
        : undefined,
    }),
    [inputCurrency, outputCurrency, parsedAmounts],
  )

  return {
    currencies,
    currencyBalances,
    inputError: getErrorMessage(
      account,
      wrappedCurrencies,
      currencies,
      currencyBalances,
      parsedAmounts,
      trade,
      price,
      rateType,
    ),
    formattedAmounts,
    trade: trade ?? undefined,
    parsedAmounts,
    price,
    rawAmounts,
    wrappedCurrencies,
    singleTokenPrice: {
      [wrappedCurrencies.input?.address]: singleTokenPrice,
      [wrappedCurrencies.output?.address]: inverseSingleTokenPrice,
    },
    currencyIds: {
      input: inputCurrencyId,
      output: outputCurrencyId,
    },
  }
}

function parseTokenAmountURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'BNB') return 'BNB'
    if (valid === false) return 'BNB'
  }
  return ''
}

// TODO: combine with swap's version but use generic type. Same for helpers above
// Note: swap has recepient and other things. Mergins these 2 would probably be much easier if we get rid of recepient
// Also the whole thing doesn't make sense, in swap inputValue is not initialized but typedValue is. WTF
const queryParametersToSwapState = (parsedQs: ParsedUrlQuery): OrderState => {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency) || DEFAULT_INPUT_CURRENCY
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency) || DEFAULT_OUTPUT_CURRENCY
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    inputValue: '',
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    rateType: Rate.MUL,
  }
}

// updates the swap state to use the defaults for a given network
export const useDefaultsFromURLSearch = ():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { query } = useRouter()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToSwapState(query)

    dispatch(replaceLimitOrdersState(parsed))

    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
  }, [dispatch, chainId, query])

  return result
}
