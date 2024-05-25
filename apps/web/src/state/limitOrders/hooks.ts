import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Native, Price, Token, Trade, TradeType } from '@pancakeswap/sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { BIG_INT_TEN, DEFAULT_INPUT_CURRENCY, DEFAULT_OUTPUT_CURRENCY } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { limitReducerAtom } from 'state/limitOrders/reducer'
import { safeGetAddress } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import getPriceForOneToken from 'views/LimitOrders/utils/getPriceForOneToken'
import { useCurrencyBalances } from '../wallet/hooks'
import { replaceLimitOrdersState, selectCurrency, setRateType, switchCurrencies, typeInput } from './actions'
import { Field, OrderState, Rate } from './types'

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

interface SignleTokenPrice {
  [key: string]: number
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
    input?: Token
    output?: Token
  }
  singleTokenPrice: SignleTokenPrice
  currencyIds: {
    input?: string
    output?: string
  }
}

const getErrorMessage = ({ t }: { t: any }) => {
  return t('Placing Order Disabled')
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
  const desiredOutputAsCurrencyAmount =
    isDesiredRateUpdate && inputValue && inputCurrency && outputCurrency
      ? getDesiredOutput(inputValue, typedValue, inputCurrency, outputCurrency, rateType === Rate.DIV)
      : undefined

  const desiredInputAsCurrencyAmount =
    isDesiredRateUpdate && outputValue && inputCurrency && outputCurrency
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
  const bestTradeExactIn = useTradeExactIn(isExactIn ? tradeAmount : undefined, outputCurrency as Currency)
  // Works similarly to swap when you modify outputCurrency
  // But also is used when desired rate is modified
  // in other words it looks for a trade of inputCurrency for whatever the amount of tokens would be at desired rate
  const bestTradeExactOut = useTradeExactOut(
    inputCurrency as Currency,
    !isExactIn || isOutputBasis ? tradeAmount : undefined,
  )
  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  // Get swap price for single token disregarding slippage and price impact
  // needed for chart's latest value
  const oneInputToken = tryParseAmount('1', currencies.input)
  const singleTokenTrade = useTradeExactIn(oneInputToken, currencies.output)
  const singleTokenPrice = parseFloat(singleTokenTrade?.executionPrice?.toSignificant(6) || '')
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

  const singleTokenPriceResult: SignleTokenPrice = {}

  if (wrappedCurrencies.input?.address) {
    singleTokenPriceResult[wrappedCurrencies.input.address] = singleTokenPrice
  }

  if (wrappedCurrencies.output?.address) {
    singleTokenPriceResult[wrappedCurrencies.output.address] = inverseSingleTokenPrice
  }

  return {
    currencies,
    currencyBalances,
    inputError: getErrorMessage({
      t,
    }),
    formattedAmounts,
    trade: trade ?? undefined,
    parsedAmounts,
    price,
    rawAmounts,
    wrappedCurrencies,
    singleTokenPrice: singleTokenPriceResult,
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
    const valid = safeGetAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'BNB') return 'BNB'
    if (valid === undefined) return 'BNB'
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
