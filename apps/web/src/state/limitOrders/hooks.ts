import { ParsedUrlQuery } from 'querystring'
import { Currency, CurrencyAmount, Trade, Token, Price, Native, TradeType } from '@pancakeswap/sdk'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { DEFAULT_INPUT_CURRENCY, DEFAULT_OUTPUT_CURRENCY, BIG_INT_TEN } from 'config/constants/exchange'
import { useRouter } from 'next/router'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useCurrency } from 'hooks/Tokens'
import { useAtom, useAtomValue } from 'jotai'
import { limitReducerAtom } from 'state/limitOrders/reducer'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import getPriceForOneToken from 'views/LimitOrders/utils/getPriceForOneToken'
import { isAddress } from 'utils'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCurrencyBalances } from '../wallet/hooks'
import { replaceLimitOrdersState, selectCurrency, setRateType, switchCurrencies, typeInput } from './actions'
import { Field, Rate, OrderState } from './types'

// Get desired input amount in output basis mode
const getDesiredInput = (
  outputValue: string,
  exchangeRate: string,
  inputCurrency: Currency,
  outputCurrency: Currency,
  isInverted: boolean,
) => {
  if (!outputValue || !inputCurrency || !outputCurrency) {
    return undefined
  }
  const parsedOutAmount = tryParseAmount(outputValue, isInverted ? inputCurrency : outputCurrency)
  const parsedExchangeRate = tryParseAmount(exchangeRate, isInverted ? inputCurrency : outputCurrency)
  if (!parsedOutAmount || !parsedExchangeRate) {
    return undefined
  }

  if (isInverted) {
    const invertedResultAsFraction = parsedOutAmount.multiply(parsedExchangeRate.asFraction)

    const invertedResultAsAmount = CurrencyAmount.fromRawAmount(inputCurrency, invertedResultAsFraction.toFixed(0))

    return invertedResultAsAmount
  }
  const resultAsFraction = parsedOutAmount
    .divide(parsedExchangeRate.asFraction)
    .multiply(BIG_INT_TEN ** BigInt(inputCurrency.decimals))

  return CurrencyAmount.fromRawAmount(inputCurrency, resultAsFraction.quotient.toString())
}

// Get desired output amount in input basis mode
const getDesiredOutput = (
  inputValue: string,
  exchangeRate: string,
  inputCurrency: Currency,
  outputCurrency: Currency,
  isInverted: boolean,
): CurrencyAmount<Native | Token> | undefined => {
  if (!inputValue || !inputCurrency || !outputCurrency) {
    return undefined
  }
  const parsedInputAmount = tryParseAmount(inputValue, isInverted ? outputCurrency : inputCurrency)
  const parsedExchangeRate = tryParseAmount(exchangeRate, isInverted ? inputCurrency : outputCurrency)

  if (!parsedExchangeRate || !parsedInputAmount) {
    return undefined
  }

  if (isInverted) {
    const invertedResultAsFraction = parsedInputAmount
      .multiply(BIG_INT_TEN ** BigInt(inputCurrency.decimals))
      .divide(parsedExchangeRate.asFraction)
    return CurrencyAmount.fromRawAmount(outputCurrency, invertedResultAsFraction.quotient)
  }

  const resultAsFraction = parsedInputAmount
    .divide(BIG_INT_TEN ** BigInt(inputCurrency.decimals))
    .multiply(parsedExchangeRate.asFraction)

  return CurrencyAmount.fromRawAmount(outputCurrency, resultAsFraction.quotient.toString())
}

// Just returns state for limitOrders
export function useOrderState() {
  return useAtomValue(limitReducerAtom)
}

// Returns handlers to change user-defined parts of limitOrders state
export const useOrderActionHandlers = (): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRateType: (rateType: Rate) => void
} => {
  const [, dispatch] = useAtom(limitReducerAtom)
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'BNB' : '',
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
    input: CurrencyAmount<Currency> | undefined
    output: CurrencyAmount<Currency> | undefined
  }
  inputError?: string
  trade: Trade<Currency, Currency, TradeType> | undefined
  parsedAmounts: {
    input: CurrencyAmount<Currency> | undefined
    output: CurrencyAmount<Currency> | undefined
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
  price: Price<Currency, Currency> | undefined
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
  currencyBalances: { input: CurrencyAmount<Currency>; output: CurrencyAmount<Currency> },
  parsedAmounts: { input: CurrencyAmount<Currency>; output: CurrencyAmount<Currency> },
  trade: Trade<Currency, Currency, TradeType>,
  price: Price<Currency, Currency>,
  rateType: Rate,
  t: any,
) => {
  if (!account) {
    return t('Connect Wallet')
  }
  if (
    wrappedCurrencies.input &&
    wrappedCurrencies.output &&
    wrappedCurrencies.input.address.toLowerCase() === wrappedCurrencies.output.address.toLowerCase()
  ) {
    return t('Order not allowed')
  }
  const hasBothTokensSelected = currencies.input && currencies.output
  if (!hasBothTokensSelected) {
    return t('Select a token')
  }
  const hasAtLeastOneParsedAmount = parsedAmounts.input || parsedAmounts.output

  const tradeIsNotAvailable = !trade || !trade?.route
  if (hasAtLeastOneParsedAmount && tradeIsNotAvailable) {
    return t('Insufficient liquidity for this trade.')
  }
  const someParsedAmountIsMissing = !parsedAmounts.input || !parsedAmounts.output
  if (someParsedAmountIsMissing) {
    return t('Enter an amount')
  }
  if (currencyBalances.input && currencyBalances.input.lessThan(parsedAmounts.input)) {
    return t(`Insufficient %symbol% balance`, { symbol: currencyBalances.input.currency.symbol })
  }

  if (price) {
    if (
      rateType === Rate.MUL &&
      (price.lessThan(trade.executionPrice.asFraction) || price.equalTo(trade.executionPrice.asFraction))
    ) {
      return t('Only possible to place sell orders above market rate')
    }
    if (
      rateType === Rate.DIV &&
      (price.invert().greaterThan(trade.executionPrice.invert().asFraction) ||
        price.invert().equalTo(trade.executionPrice.invert().asFraction))
    ) {
      return t('Only possible to place buy orders below market rate')
    }
  }

  return undefined
}

// from the current swap inputs, compute the best trade and return it.
export const useDerivedOrderInfo = (): DerivedOrderInfo => {
  const { account, chainId } = useAccountActiveChain()
  const { t } = useTranslation()
  const {
    independentField,
    basisField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    rateType,
    inputValue,
    outputValue,
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
  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency]),
  )
  const currencyBalances = {
    input: relevantTokenBalances[0],
    output: relevantTokenBalances[1],
  }

  // Get CurrencyAmount for the inputCurrency amount specified by user
  const inputAmount = useMemo(() => {
    return tryParseAmount(inputValue, inputCurrency ?? undefined)
  }, [inputValue, inputCurrency])

  // Get CurrencyAmount for the outputCurrency amount specified by user
  const outputAmount = useMemo(() => {
    return tryParseAmount(outputValue, outputCurrency ?? undefined)
  }, [outputValue, outputCurrency])

  // Whether user modified the INPUT field most recently (also default initial state)
  const isExactIn = independentField === Field.INPUT
  // Whether to base calculations on output field
  const isOutputBasis = basisField === Field.OUTPUT
  // Whether user modified the PRICE field most recently
  const isDesiredRateUpdate = independentField === Field.PRICE

  // Get the amount of outputCurrency you'd receive at the desired price
  const desiredOutputAsCurrencyAmount = isDesiredRateUpdate
    ? getDesiredOutput(inputValue, typedValue, inputCurrency, outputCurrency, rateType === Rate.DIV)
    : undefined

  const desiredInputAsCurrencyAmount = isDesiredRateUpdate
    ? getDesiredInput(outputValue, typedValue, inputCurrency, outputCurrency, rateType === Rate.DIV)
    : undefined

  // Convert output to string representation to parse later
  const desiredOutputAsString =
    isDesiredRateUpdate && desiredOutputAsCurrencyAmount ? desiredOutputAsCurrencyAmount?.toSignificant(6) : typedValue

  // If independentField === Field.PRICE -> this won't be used
  const parsedTypedAmount = !isDesiredRateUpdate
    ? tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)
    : undefined

  // If not price - cast input or output typing to CurrencyAmount
  // if price - whatever amount of tokens received on the desired price
  const tradeAmount = isDesiredRateUpdate
    ? isOutputBasis
      ? outputAmount
      : tryParseAmount(desiredOutputAsString, outputCurrency)
    : tryParseAmount(typedValue, isExactIn ? inputCurrency : outputCurrency)

  // Get trade object
  // gonna be null if not isExactIn or if there is no outputCurrency selected
  const bestTradeExactIn = useTradeExactIn(isExactIn ? tradeAmount : undefined, outputCurrency)
  // Works similarly to swap when you modify outputCurrency
  // But also is used when desired rate is modified
  // in other words it looks for a trade of inputCurrency for whatever the amount of tokens would be at desired rate
  const bestTradeExactOut = useTradeExactOut(inputCurrency, !isExactIn || isOutputBasis ? tradeAmount : undefined)
  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  // Get swap price for single token disregarding slippage and price impact
  // needed for chart's latest value
  const oneInputToken = tryParseAmount('1', currencies.input)
  const singleTokenTrade = useTradeExactIn(oneInputToken, currencies.output)
  const singleTokenPrice = parseFloat(singleTokenTrade?.executionPrice?.toSignificant(6))
  const inverseSingleTokenPrice = 1 / singleTokenPrice

  // Get "final" amounts
  const parsedAmounts = useMemo(() => {
    // Use trade amount as default
    let input = trade?.inputAmount
    if (!isOutputBasis) {
      // If we're not in output basis mode then we're in input basis mode
      // hence - no matter what keep input as specified by user
      input = inputAmount
    } else if (independentField === Field.INPUT) {
      // If user touching input field -> whatever they type currently
      input = parsedTypedAmount
    } else if (isDesiredRateUpdate) {
      // If user modifies the price AND is wishing for specific output amount -> hypothetical input amount at better price
      input = desiredInputAsCurrencyAmount
    }
    // Use trade amount as default
    // If we're in output basis mode - no matter what keep output as specified by user
    let output: CurrencyAmount<Currency> | undefined
    if (isOutputBasis) {
      output = outputAmount
    } else if (independentField === Field.OUTPUT) {
      // If user touching input field -> whatever they type currently
      output = parsedTypedAmount
    } else if (isDesiredRateUpdate) {
      // If user modifies the price AND is wishing for specific input amount -> hypothetical input amount at better price
      output = desiredOutputAsCurrencyAmount
    } else {
      output = trade?.outputAmount
    }
    return {
      input,
      output,
    }
  }, [
    independentField,
    parsedTypedAmount,
    inputAmount,
    outputAmount,
    trade,
    isDesiredRateUpdate,
    isOutputBasis,
    desiredInputAsCurrencyAmount,
    desiredOutputAsCurrencyAmount,
  ])

  // Calculate the price for specified swap
  const price = useMemo(
    () => getPriceForOneToken(parsedAmounts.input, parsedAmounts.output),
    [parsedAmounts.input, parsedAmounts.output],
  )

  // Formatted amounts to use in the UI
  const formattedAmounts = {
    input: !isOutputBasis && inputValue && inputValue !== '' ? inputValue : parsedAmounts.input?.toSignificant(6) ?? '',
    output:
      isOutputBasis && outputValue && outputValue !== '' ? outputValue : parsedAmounts.output?.toSignificant(6) ?? '',
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
        ? parsedAmounts?.input?.multiply(BIG_INT_TEN ** BigInt(inputCurrency.decimals))?.toFixed(0)
        : undefined,

      output: outputCurrency
        ? parsedAmounts?.output?.multiply(BIG_INT_TEN ** BigInt(outputCurrency.decimals))?.toFixed(0)
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
      t,
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
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : ''
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
// Note: swap has recipient and other things. Merging these 2 would probably be much easier if we get rid of recipient
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
    outputValue: '',
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    basisField: parseIndependentFieldURLParameter(parsedQs.exactField),
    rateType: Rate.MUL,
  }
}

// updates the swap state to use the defaults for a given network
export const useDefaultsFromURLSearch = ():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined => {
  const { chainId } = useActiveChainId()
  const [, dispatch] = useAtom(limitReducerAtom)
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
