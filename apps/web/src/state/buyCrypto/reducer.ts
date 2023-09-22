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

export const reducer = createReducer<BuyCryptoState>(initialState, (builder) =>
  builder
    .addCase(resetBuyCryptoState, () => initialState)
    .addCase(typeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        typedValue,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      return {
        ...state,
        [field]: { currencyId },
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
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          typedValue,
          recipient,
          minAmount,
          minBaseAmount,
          maxAmount,
          maxBaseAmount,
          userIpAddress: state.userIpAddress,
        }
      },
    ),
)

export const buyCryptoReducerAtom = atomWithReducer(initialState, reducer)
