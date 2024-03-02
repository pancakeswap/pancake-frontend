import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import { Field, replaceBuyCryptoState, resetBuyCryptoState, selectCurrency, setRecipient, typeInput } from './actions'

export interface BuyCryptoState {
  readonly typedValue: string | undefined
  readonly recipient: string | undefined
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
}

const initialState: BuyCryptoState = {
  typedValue: '',
  recipient: undefined,
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
    .addCase(typeInput, (state, { payload: { typedValue } }) => {
      state.typedValue = typedValue
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      if (field === Field.INPUT) {
        state[Field.INPUT].currencyId = currencyId
      } else if (field === Field.OUTPUT) {
        state[Field.OUTPUT].currencyId = currencyId
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
})

export const buyCryptoReducerAtom = atomWithReducer(initialState, reducer)
