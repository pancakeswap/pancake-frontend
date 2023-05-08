import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import { replaceLimitOrdersState, selectCurrency, typeInput, switchCurrencies, setRateType } from './actions'
import { Field, Rate, OrderState } from './types'

export const initialState: OrderState = {
  independentField: Field.INPUT,
  basisField: Field.INPUT,
  typedValue: '',
  inputValue: '',
  outputValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  rateType: Rate.MUL,
}

const reducer = createReducer<OrderState>(initialState, (builder) =>
  builder
    .addCase(replaceLimitOrdersState, (state, { payload }) => {
      return payload
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (field === Field.PRICE)
        return {
          ...state,
        }

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
        // independentField and typedValue need to be reset to basis field
        // to show proper market price for new pair if user adjusted the price for the previous pair
        independentField: state.basisField,
        typedValue: state.basisField === Field.INPUT ? state.inputValue : state.outputValue,
        [field]: { currencyId },
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        rateType: state.rateType,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return field === Field.INPUT
        ? {
            ...state,
            inputValue: typedValue,
            independentField: field,
            basisField: field,
            typedValue,
          }
        : {
            ...state,
            independentField: field,
            basisField: field !== Field.PRICE ? field : state.basisField,
            outputValue: field !== Field.PRICE ? typedValue : state.outputValue,
            typedValue,
          }
    })
    .addCase(setRateType, (state, { payload: { rateType } }) => {
      state.rateType = rateType
    }),
)

export const limitReducerAtom = atomWithReducer(initialState, reducer)
