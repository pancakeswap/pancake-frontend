import JSBI from 'jsbi'
import { useDispatch, useSelector } from 'react-redux'
import { ParsedUrlQuery } from 'querystring'
import { Currency, CurrencyAmount, Trade, Token, Price, Native, TradeType } from '@pancakeswap/sdk'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { DEFAULT_INPUT_CURRENCY, DEFAULT_OUTPUT_CURRENCY, BIG_INT_TEN } from 'config/constants/exchange'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { isAddress } from 'utils'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrencyBalances } from '../wallet/hooks'
import { replaceLimitOrdersState, selectCurrency, setRateType, switchCurrencies, typeInput } from './actions'
import { Field, Rate, OrderState } from './types'
import { AppState, useAppDispatch } from '..'



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
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
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
