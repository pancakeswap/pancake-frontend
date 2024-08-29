import { createReducer, type ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import { createContext, useContext } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  Field,
  replaceBuyCryptoState,
  resetBuyCryptoState,
  selectCurrency,
  switchCurrencies,
  typeInput,
} from './actions'

export interface BuyCryptoState {
  readonly typedValue: string | undefined
  readonly independentField: Field
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
}

const initialState: BuyCryptoState = {
  typedValue: '',
  independentField: Field.INPUT,

  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
}

/// casting builder as any as its causing a 'no overload match call' ts error
export const reducer = createReducer<BuyCryptoState>(
  initialState,
  (builder: ActionReducerMapBuilder<BuyCryptoState>) => {
    builder
      .addCase(resetBuyCryptoState, () => initialState)
      .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
        return {
          ...state,
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
      .addCase(replaceBuyCryptoState, (state, { payload: { typedValue, inputCurrencyId, outputCurrencyId } }) => {
        state[Field.INPUT].currencyId = inputCurrencyId
        state[Field.OUTPUT].currencyId = outputCurrencyId
        state.typedValue = typedValue
      })
      .addCase(switchCurrencies, (state) => {
        return {
          ...state,
          typedValue: '0',
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
          [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
        }
      })
  },
)

export const createFormAtom = () => atomWithReducer(initialState, reducer)

const BuyCryptoAtomContext = createContext({
  formAtom: createFormAtom(),
})

export const BuyCryptoAtomProvider = BuyCryptoAtomContext.Provider

export function useBuyCryptoFormState() {
  const ctx = useContext(BuyCryptoAtomContext)
  return useAtomValue(ctx.formAtom)
}

export function useBuyCryptoFormDispatch() {
  const ctx = useContext(BuyCryptoAtomContext)
  return useSetAtom(ctx.formAtom)
}
