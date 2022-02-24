import { createReducer } from '@reduxjs/toolkit'
import { replaceLimitOrdersState, selectCurrency, typeInput, switchCurrencies, setRateType } from './actions'
import { Field, Rate, OrderState } from './types'

export const initialState: OrderState = {
  independentField: Field.INPUT,
  typedValue: '',
  inputValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  rateType: Rate.MUL,
}

export default createReducer<OrderState>(initialState, (builder) =>
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
            typedValue,
          }
        : {
            ...state,
            independentField: field,
            typedValue,
          }
    })
    .addCase(setRateType, (state, { payload: { rateType } }) => {
      state.rateType = rateType
    }),
)
