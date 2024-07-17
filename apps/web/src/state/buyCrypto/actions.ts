import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('buyCrypto/selectCurrency')
export const typeInput = createAction<{ field: Field; typedValue: string }>('buyCrypto/typeInput')
export const resetBuyCryptoState = createAction<void>('buyCrypto/resetbuyCryptoState')
export const replaceBuyCryptoState = createAction<{
  typedValue: string
  inputCurrencyId?: string | undefined
  outputCurrencyId?: string | undefined
  recipient: string | undefined
}>('swap/replaceBuyCryptoState')
export const switchCurrencies = createAction<void>('buyCrypto/switchCurrencies')
