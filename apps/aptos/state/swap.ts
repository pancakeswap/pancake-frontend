import { APTOS_COIN } from '@pancakeswap/awgmi'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { parseTypeTag } from '@aptos-labs/ts-sdk'
import { CAKE } from 'config/coins'
import { atom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'
import { ParsedUrlQuery } from 'querystring'
import { useDeferredValue, useEffect, useState } from 'react'
import { useActiveChainId } from 'hooks/useNetwork'

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
}>('swap/replaceSwapState')

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
}

const swapStateAtom = atom(initialState)

export const useSwapState = () => {
  return useReducerAtom(swapStateAtom, reducer)
}

const reducer = createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(replaceSwapState, (state, { payload: { typedValue, field, inputCurrencyId, outputCurrencyId } }) => {
      return {
        [Field.INPUT]: {
          currencyId: inputCurrencyId,
        },
        [Field.OUTPUT]: {
          currencyId: outputCurrencyId,
        },
        independentField: field,
        typedValue,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      }
      // the normal case
      return {
        ...state,
        [field]: { currencyId },
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    }),
)

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    let valid: boolean | undefined
    try {
      parseTypeTag(decodeURIComponent(urlParam))
      valid = true
    } catch (error) {
      //
    }
    if (valid) return decodeURIComponent(urlParam)
    if (urlParam.toUpperCase() === 'APT') return APTOS_COIN
    if (valid === false) return APTOS_COIN
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

export function queryParametersToSwapState(
  parsedQs: ParsedUrlQuery,
  nativeSymbol?: string,
  defaultOutputCurrency?: string,
): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency) || nativeSymbol
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency) || defaultOutputCurrency
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
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
  }
}

function paramsToObject(entries) {
  const result = {}
  for (const [key, value] of entries) {
    result[key] = value
  }
  return result
}

export function useDefaultsFromURLSearch() {
  const chainId = useActiveChainId()
  const [, dispatch] = useSwapState()
  const [isFirstLoaded, setIsFirstLoaded] = useState(false)

  useEffect(() => {
    if (!chainId) return
    const queryObject = paramsToObject(new URL(window.location.href).searchParams)
    const parsed = queryParametersToSwapState(queryObject, APTOS_COIN, CAKE[chainId]?.address)

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
      }),
    )

    setIsFirstLoaded(true)
  }, [dispatch, chainId])

  return useDeferredValue(isFirstLoaded)
}
