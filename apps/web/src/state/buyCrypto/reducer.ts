import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import {
  Field,
  inputFlowType,
  replaceBuyCryptoState,
  resetBuyCryptoState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from './actions'

export interface BuyCryptoState {
  readonly typedValue: string | undefined
  readonly inputFlowType: 'fiat' | 'crypto'
  readonly recipient: string | undefined
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
  inputFlowType: 'crypto',
  recipient: undefined,
  independentField: Field.INPUT,

  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
}

/// casting builder as any as its causing a 'no overload match call' ts error
export const reducer = createReducer<BuyCryptoState>(initialState, (builder: any) => {
  builder
    .addCase(resetBuyCryptoState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(inputFlowType, (state) => {
      return {
        ...state,
        inputFlowType: state.inputFlowType === 'fiat' ? 'crypto' : 'fiat',
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
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
    .addCase(
      replaceBuyCryptoState,
      (state, { payload: { typedValue, recipient, inputCurrencyId, outputCurrencyId } }) => {
        state[Field.INPUT].currencyId = inputCurrencyId
        state[Field.OUTPUT].currencyId = outputCurrencyId
        state.typedValue = typedValue
        state.recipient = recipient
      },
    )
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        typedValue: '0',
        inputFlowType: state.inputFlowType === 'fiat' ? 'crypto' : 'fiat',
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    })
})

export const buyCryptoReducerAtom = atomWithReducer(initialState, reducer)
