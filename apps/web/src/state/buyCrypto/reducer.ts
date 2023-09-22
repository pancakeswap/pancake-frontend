import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import {
  Field,
  replaceBuyCryptoState,
  resetBuyCryptoState,
  selectCurrency,
  setMinAmount,
  setRecipient,
  setUsersIpAddress,
  typeInput,
} from './actions'

export interface BuyCryptoState {
  readonly typedValue: string | undefined
  readonly recipient: string | undefined
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  readonly minAmount: number | undefined
  readonly minBaseAmount: number | undefined
  readonly maxAmount: number | undefined
  readonly maxBaseAmount: number | undefined
  readonly userIpAddress: string | undefined
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
  minAmount: undefined,
  minBaseAmount: undefined,
  maxAmount: undefined,
  maxBaseAmount: undefined,
  userIpAddress: undefined,
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
    .addCase(setMinAmount, (state, { payload: { minAmount, minBaseAmount, maxAmount, maxBaseAmount } }) => {
      state.minAmount = minAmount
      state.minBaseAmount = minBaseAmount
      state.maxAmount = maxAmount
      state.maxBaseAmount = maxBaseAmount
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
    .addCase(setUsersIpAddress, (state, { payload: { ip } }) => {
      state.userIpAddress = ip
    })
    .addCase(
      replaceBuyCryptoState,
      (
        state,
        {
          payload: {
            typedValue,
            recipient,
            inputCurrencyId,
            outputCurrencyId,
            minAmount,
            minBaseAmount,
            maxAmount,
            maxBaseAmount,
          },
        },
      ) => {
        state[Field.INPUT].currencyId = inputCurrencyId
        state[Field.OUTPUT].currencyId = outputCurrencyId
        state.typedValue = typedValue
        state.recipient = recipient
        state.minAmount = minAmount
        state.minBaseAmount = minBaseAmount
        state.maxAmount = maxAmount
        state.maxBaseAmount = maxBaseAmount
      },
    )
})

export const buyCryptoReducerAtom = atomWithReducer(initialState, reducer)
