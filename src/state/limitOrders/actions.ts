import { createAction } from '@reduxjs/toolkit'
import { Field, Rate, OrderState } from './types'

export const replaceLimitOrdersState = createAction<OrderState>('limitOrders/replaceLimitOrdersState')
export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('limitOrders/selectCurrency')
export const switchCurrencies = createAction<void>('limitOrders/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('limitOrders/typeInput')
export const setRateType = createAction<{ rateType: Rate }>('limitOrders/setRateType')
